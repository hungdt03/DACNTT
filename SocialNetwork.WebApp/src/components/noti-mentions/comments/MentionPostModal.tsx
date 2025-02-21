import { FC, useEffect, useState } from "react";
import { UploadFile, message } from "antd";
import { CommentResource } from "../../../types/comment";
import commentService from "../../../services/commentService";
import { PostResource } from "../../../types/post";
import BoxSendComment, { BoxCommentType } from "../../comments/BoxSendComment";
import { imageTypes } from "../../../utils/file";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { MediaType } from "../../../enums/media";
import { BoxReplyCommentType } from "../../comments/BoxReplyComment";
import postService from "../../../services/postService";
import MentionPostInner from "./MentionPostInner";
import { MentionCommentList } from "./MentionCommentList";
import { CommentMentionPagination } from "../../../utils/pagination";

export type BoxCommendStateType = {
    fileList: UploadFile[];
    content: string;
}

type MentionPostModalProps = {
    postId: string;
    commentId?: string
}

const MentionPostModal: FC<MentionPostModalProps> = ({
    postId,
    commentId
}) => {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(selectAuth);
    const [post, setPost] = useState<PostResource | null>(null);
    const [comments, setComments] = useState<CommentResource[]>([])
    const [pendingComments, setPendingComments] = useState<CommentResource[]>([])

    const [pagination, setPagination] = useState<CommentMentionPagination>({
        prevPage: 1,
        nextPage: 1,
        haveNextPage: false,
        havePrevPage: false
    })

    const handleCreateComment = async (values: BoxCommentType) => {
        const sentAt = new Date()

        const tempComment: CommentResource = {
            id: new Date().toISOString(),
            content: values.content,
            sentAt: sentAt,
            user: user!,
            postId,
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
        setLoading(true)
        const response = await commentService.getNearbyCommentsByCommentId(postId, commentId);
        setLoading(false)
        if (response.isSuccess) {
            setComments(prev => [...prev, ...response.data])
            setPagination(response.pagination)
        }
    }

    const fetchPrevComments = async (parentCommentId: string | null, page: number) => {
        const response = await commentService.getPrevComments(postId, parentCommentId, page);
        if (response.isSuccess) {
            setComments(prevComments => [...response.data, ...prevComments])
            setPagination(prevPagination => ({
                ...prevPagination,
                prevPage: response.pagination.prevPage,
                havePrevPage: response.pagination.havePrevPage
            }))
        }
    }

    const fetchNextComment = async (parentCommentId: string | null, page: number) => {
        const response = await commentService.getNextComments(postId, parentCommentId, page);
        if (response.isSuccess) {
            setComments(prevComments => [...prevComments, ...response.data])
            setPagination(prevPagination => ({
                ...prevPagination,
                nextPage: response.pagination.nextPage,
                haveNextPage: response.pagination.haveNextPage
            }))
        }
    }

    const fetchPost = async () => {
        const response = await postService.getPostById(postId);
        if (response.isSuccess) {
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
            postId: postId,
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

        parentCommentId && handleUpdateCommentList(parentCommentId, [tempReplyComment], false)
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

    const updateNextComments = (
        comments: CommentResource[],
        commentId: string,
        replies: CommentResource[],
    ): CommentResource[] => {
        return comments.map((comment) => {
            if (comment.id === commentId) {
                const updatedReplies = comment.replies ? [...comment.replies, ...replies] : [...replies];
                return { ...comment, isHaveChildren: true, replies: updatedReplies };
            }

            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateNextComments(comment.replies, commentId, replies),
                };
            }

            return comment;
        });
    };

    const updatePrevComments = (
        comments: CommentResource[],
        commentId: string,
        replies: CommentResource[],
    ): CommentResource[] => {
        return comments.map((comment) => {
            if (comment.id === commentId) {
                const updatedReplies = comment.replies ? [...replies, ...comment.replies] : [...replies];
                return { ...comment, isHaveChildren: true, replies: updatedReplies };
            }

            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updatePrevComments(comment.replies, commentId, replies),
                };
            }

            return comment;
        });
    };


    const handleUpdateCommentList = (commentId: string, replies: CommentResource[], isPrev: boolean) => {
        setComments((prevComments) => isPrev ? updatePrevComments(prevComments, commentId, replies) : updateNextComments(prevComments, commentId, replies))
    }

    const removeComment = (commentId: string) => {
        setComments((prevComments) => {
            const updateComments = (comments: CommentResource[]): CommentResource[] => {
                return comments.flatMap((comment) => {
                    if (comment.id === commentId) {
                        return comment.replies || [];
                    }

                    if (comment.replies && comment.replies.length > 0) {
                        const updatedReplies = updateComments(comment.replies);
                        const isHaveChildren = updatedReplies.length > 0;

                        return {
                            ...comment,
                            replies: updatedReplies,
                            isHaveChildren: isHaveChildren,
                        };
                    }

                    return comment;
                });
            };

            return updateComments(prevComments);
        });
    };

    const handleDeleteComment = async (commentId: string) => {
        const response = await commentService.deleteCommentById(commentId);
        if (response.isSuccess) {
            removeComment(commentId)
            message.success(response.message);
        } else {
            message.error(response.message)
        }
    }

    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md h-[550px] pb-10 overflow-y-auto custom-scrollbar">
        {post && <>
            <MentionPostInner post={post} />

            <MentionCommentList
                activeCommentId={commentId}
                comments={[...pendingComments.filter(p => p.level === 0), ...comments]}
                pagination={pagination}
                replyComment={handleReplyComment}
                updatedComments={handleUpdateCommentList}
                onFetchNextPage={fetchNextComment}
                onFetchPrevPage={fetchPrevComments}
                onDeleteComment={handleDeleteComment}
                loading={loading}
                post={post}
                group={post?.group}
            />
        </>}

        <div className="shadow p-4 absolute left-0 right-0 bottom-0 bg-white rounded-b-md">
            <BoxSendComment
                onSubmit={handleCreateComment}
                key={'box-send-comment'}
            />
        </div>
    </div>
};

export default MentionPostModal;

