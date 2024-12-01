import { HeartIcon, MoreHorizontal, ShareIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Avatar, Divider, Modal, Popover, Tooltip, message } from "antd";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { CommentRequest, PostMoreAction } from "../posts/Post";
import { svgReaction } from "../../assets/svg";
import useModal from "../../hooks/useModal";
import PostReactionModal from "./PostReactionModal";
import cn from "../../utils/cn";
import BoxReplyComment from "../BoxReplyComment";
import { PostReaction } from "../posts/PostReaction";
import { CommentResource } from "../../types/comment";
import { formatTime } from "../../utils/date";
import commentService from "../../services/commentService";
import { PostResource } from "../../types/post";
import { BoxCommentType } from "../BoxSendComment";
import { Pagination } from "../../types/response";


type CommentItemProps = {
    parentComment: CommentResource | null;
    comment: CommentResource;
    onReply: (id: string) => void;
    replyToId: string | null;
    level: number;
    updatePagination?: (page: number, size: number, hasMore: boolean) => void;
    onFetchReplies?: (commentId: string, page: number, size: number) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[]) => void;
    replyComment: (values: BoxCommentType, parentCommentId: string | null, replyToUserId: string | null) => void
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onReply,
    replyToId,
    replyComment,
    onFetchReplies,
    updatedComments,
    level
}) => {
    const isReplying = replyToId === comment.id;

    const [content, setContent] = useState<string>('')
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        size: 6,
        hasMore: false
    })

    const handleFetchReplies = async (commentId: string, page: number, size: number) => {
        const response = await commentService.getAllRepliesByCommentId(commentId, page, size);
        if (response.isSuccess) {
            const fetchedReplies = response.data;
            setPagination(response.pagination)
            updatedComments(commentId, fetchedReplies)
        }
    }

    const handleReplyComment = (values: BoxCommentType, parentCommentId: string | null, replyToUserId: string | null) => {
        replyComment(values, parentCommentId, replyToUserId);
        setContent('')
    }

    return (
        <div className={cn("relative flex flex-col pl-4", comment.parentCommentId !== null ? "gap-y-5" : "gap-y-3")}>
            {comment.isHaveChildren && (comment?.replies?.length ?? 0) !== 0 && <div className="absolute left-8 w-[2px] top-[28px] bottom-16 border-b-[2px] rounded-lg bg-gray-200"></div>}
            {/* Comment nội dung */}
            <div className="relative flex items-start gap-x-2">
                {comment.parentCommentId && (
                    <div className="absolute -left-[24px] w-7 top-[0px] h-[20px] bg-transparent border-b-[2px] rounded-lg border-gray-200"></div>
                )}
                <Avatar className="flex-shrink-0" src={images.user} />
                <div className="flex flex-col gap-y-1">
                    <div className="py-2 px-4 rounded-2xl bg-gray-100 flex flex-col items-start">
                        <span className="font-semibold">{comment.user.fullName}</span>
                        <p className="text-left">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-x-4 px-2">
                        <span className="text-xs">{formatTime(new Date(comment.createdAt))}</span>
                        <button
                            className="text-xs hover:underline"
                            onClick={() => onReply(comment.id)}
                        >
                            Phản hồi
                        </button>
                    </div>
                </div>

                {/* LINE */}
                {isReplying && !comment.isHaveChildren && level < 3 && <div className="absolute left-4 w-[66px] top-[31px] h-full bg-transparent border-l-[2px] border-gray-200"></div>}
            </div>

            {comment.isHaveChildren && (comment?.replies?.length ?? 0) === 0 && <button onClick={() => handleFetchReplies(comment.id, pagination.page, pagination.size)} className="font-semibold text-left pl-12 text-xs">Xem các phản hồi</button>}
            {/* Render comment con */}
            {comment.isHaveChildren && (
                <div className="relative flex flex-col gap-y-3 pl-6">
                    {comment?.replies?.map((child) => (
                        <CommentItem
                            parentComment={comment}
                            key={child.id}
                            comment={child}
                            onFetchReplies={onFetchReplies}
                            replyComment={replyComment}
                            onReply={onReply}
                            updatedComments={updatedComments}
                            replyToId={replyToId}
                            level={level + 1}
                        />
                    ))}

                    {pagination.hasMore && <button onClick={() => handleFetchReplies?.(comment.id, pagination.page + 1, pagination.size)} className="font-semibold text-left pl-6 mb-2 text-xs">Xem thêm phản hồi</button>}


                    {/* Box phản hồi ở cuối nếu đang reply comment này */}
                    {isReplying && (
                        <>
                            <div className="absolute left-4 w-[28px] -top-[24px] h-full bg-transparent border-l-[2px] border-b-[2px] rounded-bl-lg border-gray-200"></div>
                            <div className={cn(level === 3 ? "pl-0" : "pl-4")}>
                                <BoxReplyComment value={content} onContentChange={(newValue) => setContent(newValue)} onSubmit={(values => handleReplyComment(values, comment.id, comment.user.id))} />
                            </div>
                        </>
                    )}
                  
                </div>
            )}

            {/* Nếu không có comment con, hiển thị box reply trực tiếp dưới comment */}
            {isReplying && !comment.isHaveChildren && (
                <div className="relative">
                    {level < 3 &&
                        <div className="absolute left-4 w-[24px] -top-[25px] h-full bg-transparent border-l-[2px] border-b-[2px] rounded-bl-lg border-gray-200"></div>
                    }
                    <div className={cn(level === 3 ? "pl-0" : "pl-10")}>
                        {level >= 3 && <div className="absolute -left-6 w-[24px] -top-[28px] h-full bg-transparent border-l-[2px] border-b-[2px] rounded-bl-lg border-gray-200"></div>}
                        <BoxReplyComment value={content} onContentChange={(newValue) => setContent(newValue)} onSubmit={(values => replyComment(values, comment.id, comment.user.id))} />
                    </div>
                </div>
            )}
        </div>
    );
};

type CommentListProps = {
    comments: CommentResource[];
    pagination: Pagination;
    replyComment: (values: BoxCommentType, parentCommentId: string | null, replyToUserId: string | null) => void
    onFetchReplies?: (commentId: string) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[]) => void;
    fetchNextPage: (page: number, size: number) => void;
}

export const CommentList: React.FC<CommentListProps> = ({
    comments,
    replyComment,
    pagination,
    onFetchReplies,
    updatedComments,
    fetchNextPage
}) => {
    const [replyToId, setReplyToId] = useState<string | null>(null);


    const handleReply = (id: string) => {
        setReplyToId((prev) => (prev === id ? null : id));
    };


    return (
        <div className="flex flex-col gap-y-3">
            {comments.map((comment) => (
                <CommentItem
                    parentComment={null}
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    replyToId={replyToId}
                    level={1}
                    onFetchReplies={onFetchReplies}
                    updatedComments={updatedComments}
                    replyComment={replyComment}
                />

            ))}

            {pagination.hasMore && <button onClick={() => fetchNextPage(pagination.page + 1, pagination.size)} className="text-center text-xs font-semibold">Tải thêm bình luận</button>}
        </div>
    );
};



type PostModalProps = {
    post: PostResource;
}

const PostModal: FC<PostModalProps> = ({
    post
}) => {
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal()
    const [comments, setComments] = useState<CommentResource[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        size: 6,
        hasMore: false
    })


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
        const comment: CommentRequest = {
            content: values.content,
            postId: post.id,
            parentCommentId: parentCommentId,
            replyToUserId: replyToUserId,
        };

        const response = await commentService.createComment(comment);
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

    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md h-[450px] overflow-y-auto custom-scrollbar">
        <Divider className="my-0" />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <Avatar className="w-10 h-10" src={images.user} />
                <div className="flex flex-col gap-y-[1px]">
                    <span className="font-semibold text-[16px] text-gray-600">Bùi Văn Yên</span>
                    <div className="flex items-center gap-x-2">
                        <Tooltip title='Thứ bảy, 23 tháng 11, 2014 lúc 19:17'>
                            <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">35 phút trước</span>
                        </Tooltip>
                        <Tooltip title='Công khai'>
                            <button className="mb-[2px]">
                                <img className="w-3 h-3" src={images.earth} alt="Public" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <Popover content={<PostMoreAction />}>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <MoreHorizontal className="text-gray-400" />
                </button>
            </Popover>
        </div>

        <div className="flex flex-col gap-y-3">
            <p className="text-sm text-gray-700">tttttttt Các cao nhân IT chỉ cách cứu dùm em, ổ C của lap em đang bị đỏ mặc dù đã xóa bớt đi mấy file không dùng. Giờ em phải làm sao cho nó về bth lại đây ạ :(((. Cao nhân chỉ điểm giúp em với</p>

            <div>
                <img src={images.cover} />
            </div>
        </div>
        <div className="flex items-center justify-between text-sm">
            <button onClick={showModal} className="flex gap-x-[2px] items-center">
                <Avatar.Group>
                    <img src={svgReaction.like} className="w-5 h-5 mx-[5px]" />
                    <img src={svgReaction.love} className="w-5 h-5 mx-[5px]" />
                    <img src={svgReaction.care} className="w-5 h-5 mx-[5px]" />
                </Avatar.Group>
                <span className="hover:underline">112</span>
            </button>
            <div className="flex gap-x-4 items-center">
                <button className="hover:underline text-gray-500">17 bình luận</button>
                <button className="hover:underline text-gray-500">17 lượt chia sẻ</button>
            </div>
        </div>
        <Divider className='my-0' />
        <div className="flex items-center justify-between gap-x-4">
            <Popover content={<PostReaction />}>
                <button className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                    <HeartIcon className="h-5 w-5 text-gray-500" />
                    <span>Thích</span>
                </button>
            </Popover>
            <button className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-500" />
                <span>Bình luận</span>
            </button>
            <button className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ShareIcon className="h-5 w-5 text-gray-500" />
                <span>Chia sẻ</span>
            </button>
        </div>
        <Divider className='mt-0 mb-2' />

        <CommentList
            replyComment={handleReplyComment}
            comments={comments}
            updatedComments={handleUpdateCommentList}
            pagination={pagination}
            fetchNextPage={fetchComments}
        />

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Cảm xúc bài viết</p>} width='600px' footer={[]} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <PostReactionModal />
        </Modal>
    </div>
};

export default PostModal;

