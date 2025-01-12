import { FC, useEffect, useState } from "react";
import { UploadFile, message } from "antd";
import { CommentResource } from "../../types/comment";
import commentService from "../../services/commentService";
import { PostResource } from "../../types/post";
import BoxSendComment, { BoxCommentType } from "../comments/BoxSendComment";
import { Pagination } from "../../types/response";
import { CommentList } from "../comments/CommentList";
import { imageTypes } from "../../utils/file";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { MediaType } from "../../enums/media";
import { BoxReplyCommentType } from "../comments/BoxReplyComment";
import postService from "../../services/postService";
import HighlightPostInner from "./HighlightPostInner";
import { HighlightCommentList } from "./HighlightCommentList";

export type BoxCommendStateType = {
    fileList: UploadFile[];
    content: string;
}

type HighlightPostModalProps = {
    postId: string;
    commentId: string
}

const HighlightPostModal: FC<HighlightPostModalProps> = ({
    postId,
    commentId
}) => {
    const { user } = useSelector(selectAuth);
    const [post, setPost] = useState<PostResource | null>(null);
    const [comments, setComments] = useState<CommentResource[]>([])
    const [pendingComments, setPendingComments] = useState<CommentResource[]>([])

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        size: 6,
        hasMore: false
    })

    const handleCreateComment = async (values: BoxCommentType) => {
        const sentAt = new Date()

        const tempComment: CommentResource = {
            id: new Date().toISOString(),
            content: values.content,
            sentAt: sentAt,
            user: user!,
            isHaveChildren: false,
            replies: [],
            createdAt: sentAt,
            status: 'pending',
            mediaType: MediaType.IMAGE,
            level: 0,
        };


        const formData = new FormData();
        formData.append('content', values.content);


        formData.append('sentAt', sentAt.toISOString())
        formData.append('postId', postId);
        values?.mentionUserIds?.forEach(mention => formData.append('mentionUserIds', mention))

        if (values?.file?.originFileObj) {
            const isImage = imageTypes.includes(values.file.type as string) || (values.file.type as string).includes("image/")
            if (!isImage) {
                tempComment.mediaType = MediaType.VIDEO
            }

            tempComment.mediaUrl = URL.createObjectURL(values.file.originFileObj)

            formData.append('file', values.file.originFileObj, values.file.name);
        }

        setPendingComments(prev => [tempComment, ...prev])

        const response = await commentService.createComment(formData);
        if (response.isSuccess) {
            setPendingComments(prev => prev.filter(cmt => cmt.level === 0 && cmt.sentAt.getTime() !== new Date(response.data.sentAt).getTime()))
            setComments((prevComment) => [response.data, ...prevComment])
            message.success('Tải bình luận thành công')
        } else {
            message.error('Có lỗi xảy ra khi tải bình luận')
        }
    }

    const fetchComments = async () => {
        const response = await commentService.getNearbyCommentsByCommentId(postId, commentId);
        console.log(response)
        if (response.isSuccess) {
            setComments(prev => [...prev, ...response.data])
            // setPagination(response.pagination)
        }
    }

    const fetchPost = async () => {
        const response = await postService.getPostById(postId);
        console.log(response)
        if(response.isSuccess) {
            setPost(response.data)
        }
    }

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [postId])

    const handleReplyComment = async (values: BoxReplyCommentType, parentCommentId: string | null, replyToUserId: string | undefined, level: number) => {
        const sentAt = new Date();

        const tempReplyComment: CommentResource = {
            id: new Date().toISOString(),
            content: values.content,
            sentAt: sentAt,
            user: user!,
            isHaveChildren: false,
            parentCommentId,
            replies: [],
            createdAt: sentAt,
            status: 'pending',
            mediaType: MediaType.IMAGE,
            level
        };
       
        const formData = new FormData();
        formData.append('content', values.content);
        formData.append('postId', postId);
        formData.append('parentCommentId', parentCommentId as string);
        formData.append('replyToUserId', replyToUserId as string);
        formData.append('sentAt', sentAt.toISOString());
        values?.mentionUserIds?.forEach(mention => formData.append('mentionUserIds', mention))

        if (values?.file?.originFileObj) {
            formData.append('file', values.file.originFileObj, values.file.name);

            const isImage = imageTypes.includes(values.file.type as string) || (values.file.type as string).includes("image/")
            if (!isImage) {
                tempReplyComment.mediaType = MediaType.VIDEO
            }
            tempReplyComment.mediaUrl = URL.createObjectURL(values.file.originFileObj)
        }

        parentCommentId && handleUpdateCommentList(parentCommentId, [tempReplyComment])
        const response = await commentService.createComment(formData);
        if (response.isSuccess) {
            
            if (response.data.parentCommentId) {
                replaceTempCommentWithResponse(response.data)
            }

            message.success(response.message)
            return true;
        } else {
            message.error(response.message)
            return false;
        }
    }

    const replaceTempCommentWithResponse = (updatedComment: CommentResource) => {
        setComments((prevComments) => {
            const updateComments = (comments: CommentResource[]): CommentResource[] => {
                return comments.map((comment) => {
                    if (comment.parentCommentId && comment.status === 'pending' && comment.sentAt.getTime() === new Date(updatedComment.sentAt).getTime()) {
                        return { ...updatedComment };
                    }
    
                    if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: updateComments(comment.replies),
                        };
                    }
    
                    return comment;
                });
            };
    
            return updateComments(prevComments);
        });
    };

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

    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md h-[550px] pb-10 overflow-y-auto custom-scrollbar">
        {post && <HighlightPostInner post={post} />}
        
        <HighlightCommentList
            replyComment={handleReplyComment}
            comments={[...pendingComments.filter(p => p.level === 0), ...comments]}
            updatedComments={handleUpdateCommentList}
            pagination={pagination}
            fetchNextPage={fetchComments}
            activeCommentId={commentId}
        />

        <div className="shadow p-4 absolute left-0 right-0 bottom-0 bg-white rounded-b-md">
            <BoxSendComment
                onSubmit={handleCreateComment}
                key={'box-send-comment'}
            />
        </div>
    </div>
};

export default HighlightPostModal;

