import { FC, useEffect, useState } from "react";
import {   UploadFile, message } from "antd";
import { CommentResource } from "../../types/comment";
import commentService from "../../services/commentService";
import { PostResource } from "../../types/post";
import BoxSendComment, { BoxCommentType } from "../comments/BoxSendComment";
import { Pagination } from "../../types/response";
import { CommentList } from "../comments/CommentList";
import { Id, toast } from "react-toastify";

export type BoxCommendStateType = {
    fileList: UploadFile[];
    content: string;
}

type PostModalProps = {
    post: PostResource;
}

const PostModal: FC<PostModalProps> = ({
    post
}) => {
    const [comments, setComments] = useState<CommentResource[]>([])
    const [commentData, setCommentData] = useState<BoxCommendStateType>({
        content: '',
        fileList: []
    })

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        size: 6,
        hasMore: false
    })

    const handleCreateComment = async (values: BoxCommentType) => {
        const formData = new FormData();
        formData.append('content', values.content);
        formData.append('postId', post.id);

        if(values?.file?.originFileObj) {
            formData.append('file', values.file.originFileObj, values.file.name);
        }

        const toastId: Id = toast.loading('Đang viết bình luận... Vui lòng không refresh lại trang');
        const response = await commentService.createComment(formData);
        if (response.isSuccess) {
            toast.update(toastId, {
                render: response.message,
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
            setComments((prevComment) => [response.data, ...prevComment])
            setCommentData({
                content: '',
                fileList: []
            })
        } else {
            toast.update(toastId, {
                render: response.message,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        }
    }

    const fetchComments = async (page: number, size: number) => {
        const response = await commentService.getAllRootCommentsByPostId(post.id, page, size);
        if (response.isSuccess) {
            setComments(prev => [...prev, ...response.data])
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchComments(pagination.page, pagination.size)
    }, [post])

    const handleReplyComment = async (values: BoxCommentType, parentCommentId: string | null, replyToUserId: string | null) => {

        const formData = new FormData();
        formData.append('content', values.content);
        formData.append('postId', post.id);
        formData.append('parentCommentId', parentCommentId as string);
        formData.append('replyToUserId', replyToUserId as string);

        if(values?.file?.originFileObj) {
            formData.append('file', values.file.originFileObj, values.file.name);
        }

        const response = await commentService.createComment(formData);
        if (response.isSuccess) {
            message.success(response.message)

            if (response.data.parentCommentId) {
                handleUpdateCommentList(response.data.parentCommentId, [response.data])
            }

            return true;
        } else {
            message.error(response.message)
            return false;
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

    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md h-[550px] pb-10 overflow-y-auto custom-scrollbar">
        <CommentList
            replyComment={handleReplyComment}
            comments={comments}
            updatedComments={handleUpdateCommentList}
            pagination={pagination}
            fetchNextPage={fetchComments}
        />

        <div className="shadow p-4 absolute left-0 right-0 bottom-0 bg-white rounded-b-md">
            <BoxSendComment 
                value={commentData.content} 
                onContentChange={(newValue) => setCommentData({
                    ...commentData,
                    content: newValue
                })} 
                onSubmit={handleCreateComment} 
                key={'box-send-comment'}
                files={commentData.fileList}
                onFileChange={(file) => setCommentData({
                    ...commentData,
                    fileList: [file]
                })}
             />
        </div>
    </div>
};

export default PostModal;

