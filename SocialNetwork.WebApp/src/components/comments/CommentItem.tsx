import { useState } from "react";
import { CommentResource } from "../../types/comment";
import { BoxCommentType } from "./BoxSendComment";
import { Pagination } from "../../types/response";
import commentService from "../../services/commentService";
import images from "../../assets";
import { Avatar } from "antd";
import cn from "../../utils/cn";
import { formatTime } from "../../utils/date";
import BoxReplyComment from "./BoxReplyComment";

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
        console.log('REPLY COMMENT HERRE')
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
                <Avatar className="flex-shrink-0" src={comment.user.avatar ?? images.user} />
                <div className="flex flex-col gap-y-1">
                    <div className="py-2 px-4 rounded-2xl bg-gray-100 flex flex-col items-start">
                        <span className="font-semibold">{comment?.user?.fullName}</span>
                        <p className="text-left flex items-center gap-x-1">
                            {comment.replyToUserId && <button className="font-bold rounded-lg text-sm">{comment.replyToUserName}</button>}
                            {comment.content}
                        </p>
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
                                <BoxReplyComment key={'box-repy-1'} value={content} onContentChange={(newValue) => setContent(newValue)} onSubmit={(values => handleReplyComment(values, comment.id, comment.user.id))} />
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
                        <BoxReplyComment key={'box-reply-2'} value={content} onContentChange={(newValue) => setContent(newValue)} onSubmit={(values => handleReplyComment(values, comment.id, comment.user.id))} />
                    </div>
                </div>
            )}
        </div>
    );
};


