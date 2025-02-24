import { FC, useEffect, useState } from "react";
import PostItem from "../../../components/posts/admin/PostItem";
import { PostResource } from "../../../types/post";
import { useParams } from "react-router-dom";
import postService from "../../../services/postService";
import { PostCommentList } from "../../../components/comments/admin/PostCommentList";
import { CommentResource } from "../../../types/comment";
import commentService from "../../../services/commentService";
import { Pagination } from "../../../types/response";
import { Progress } from "antd";
import { ReactionResource } from "../../../types/reaction";
import reactionService from "../../../services/reactionService";
import { ReactionType } from "../../../enums/reaction";
import { svgReaction } from "../../../assets/svg";
import { PostType } from "../../../enums/post-type";
import PostGroup from "../../../components/posts/PostGroup";
import LoadingIndicator from "../../../components/LoadingIndicator";
import PostItemGroup from "../../../components/posts/admin/PostGroupItem";

export const getReactionPercentages = (reactions?: ReactionResource[]) => {
    if (!reactions?.length) return { total: 0, data: [] };

    const total = reactions.length;
    const counts = reactions.reduce((acc, reaction) => {
        acc[reaction.reactionType] = (acc[reaction.reactionType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        total,
        data: Object.entries(counts).map(([reactionType, count]) => ({
            reactionType,
            percent: Math.round((count / total) * 100),
            count
        }))
    };
};


const PostDetailPage: FC = () => {
    const { postId } = useParams()
    const [post, setPost] = useState<PostResource>();
    const [comments, setComments] = useState<CommentResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(false)

    const [reactions, setReactions] = useState<ReactionResource[]>();

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        size: 6,
        hasMore: false
    })

    const fetchReactions = async () => {
        if (postId) {
            const response = await reactionService.getAllReactionsByPostId(postId);

            if (response.isSuccess) {
                setReactions(response.data)
            }
        }
    }

    const fetchPost = async () => {
        if (postId) {
            setPostLoading(true)
            const response = await postService.getPostById(postId);
            setPostLoading(false)
            if (response.isSuccess) {
                setPost(response.data)
            }
        }
    }

    const fetchComments = async (page: number, size: number) => {
        if (postId) {
            setLoading(true)
            const response = await commentService.getAllRootCommentsByPostId(postId, page, size);
            setLoading(false)
            if (response.isSuccess) {
                setComments(prev => [...prev, ...response.data])
                setPagination(response.pagination)
            }
        }
    }

    const updateRepliesInComments = (
        comments: CommentResource[],
        commentId: string,
        fetchedReplies: CommentResource[]
    ): CommentResource[] => {
        return comments.map((comment) => {
            if (comment.id === commentId) {
                const updatedReplies = comment.replies ? [...comment.replies, ...fetchedReplies] : [...fetchedReplies];
                return { ...comment, isHaveChildren: true, replies: updatedReplies };
            }

            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateRepliesInComments(comment.replies, commentId, fetchedReplies),
                };
            }

            return comment;
        });
    };

    const handleUpdateCommentList = (commentId: string, replies: CommentResource[]) => {
        setComments((prevComments) => updateRepliesInComments(prevComments, commentId, replies))
    }

    useEffect(() => {
        fetchPost();
        fetchReactions();
        fetchComments(pagination.page, pagination.size)
    }, [postId])

    const { total, data } = getReactionPercentages(reactions);

    return postLoading ? <LoadingIndicator title="Đang tải dữ liệu bài viết" /> : <div className="grid grid-cols-2 h-full overflow-hidden gap-4">
        <div className="flex flex-col gap-y-4 h-full overflow-y-auto custom-scrollbar">
            {post?.isGroupPost ? post && <PostItemGroup post={post} /> : post && <PostItem post={post} />}

            {post?.postType === PostType.SHARE_POST && <div className="p-4 rounded-md bg-white shadow">
                <span className="text-lg font-bold mb-2 inline-block">Bài viết gốc</span>
                {post?.originalPost?.isGroupPost ? <PostItemGroup post={post.originalPost} /> : <PostItem post={post.originalPost} />}
            </div>}

        </div>
        <div className="h-full overflow-y-auto flex flex-col gap-y-4">
            
        <div className="p-4 rounded-md bg-white shadow">
                <span className="text-lg font-bold mb-2 inline-block">Tương tác bài viết ({reactions?.length} cảm xúc, {post?.shares} lượt chia sẻ)</span>
                <div className="flex flex-col gap-y-4 w-full">
                    {data.map(({ reactionType, percent, count }) => (
                        <div className="flex items-center gap-x-2" key={reactionType}>
                            <div className="flex items-center gap-x-1 flex-shrink-0">
                                <img alt={reactionType} className="w-[15px] h-[15px]" src={svgReaction[reactionType as ReactionType]} />
                                <span>({count})</span>
                            </div>
                            <Progress key={reactionType} status="active" strokeColor={'green'} percent={percent} size="small" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between z-10 w-full p-4 shadow rounded-md bg-white">
                <span className="text-lg font-bold">Bình luận bài viết</span>
                <span className="text-lg font-bold">{post?.comments}</span>
            </div>
            {comments.length > 0 && post && <div className="h-full overflow-y-auto custom-scrollbar p-4 rounded-md shadow bg-white">
                <PostCommentList
                    loading={loading}
                    comments={comments}
                    fetchNextPage={fetchComments}
                    updatedComments={handleUpdateCommentList}
                    post={post}
                    group={post.group}
                    onDeleteComment={() => { }}
                    pagination={pagination}
                />
            </div>}
        </div>
    </div>
};

export default PostDetailPage;
