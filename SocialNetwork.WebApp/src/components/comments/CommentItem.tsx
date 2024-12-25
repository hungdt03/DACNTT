import { useState } from "react";
import { CommentResource } from "../../types/comment";
import { BoxCommentType } from "./BoxSendComment";
import { Pagination } from "../../types/response";
import commentService from "../../services/commentService";
import images from "../../assets";
import { Avatar, Image } from "antd";
import cn from "../../utils/cn";
import { formatTime } from "../../utils/date";
import BoxReplyComment from "./BoxReplyComment";
import { MediaType } from "../../enums/media";
import { BoxCommendStateType } from "../modals/PostModal";
import { UserResource } from "../../types/user";

type CommentItemProps = {
    parentComment: CommentResource | null;
    comment: CommentResource;
    level: number;
    onReply?: (comment: CommentResource) => void;
    updatePagination?: (page: number, size: number, hasMore: boolean) => void;
    onFetchReplies?: (commentId: string, page: number, size: number) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[]) => void;
    replyComment: (values: BoxCommentType, parentCommentId: string | null, replyToUserId: string | undefined, level: number) => void
}



export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    replyComment,
    onFetchReplies,
    updatedComments,
    level,
    onReply
}) => {
    const [isReplying, setIsReplying] = useState(false)
    const [replyToUser, setReplyToUser] = useState<UserResource>(comment.user)

    const [commentData, setCommentData] = useState<BoxCommendStateType>({
        content: '',
        fileList: []
    })

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

    const handleReplyComment = (values: BoxCommentType, parentCommentId: string | null) => {
        replyComment(values, parentCommentId, replyToUser?.id, level);
        setCommentData({
            content: '',
            fileList: []
        })
    }

    return (
        <div className={cn("relative flex flex-col pl-4", comment.parentCommentId !== null ? "gap-y-5" : "gap-y-3")}>
            {comment.isHaveChildren && <div className={cn("absolute left-8 w-[2px] top-[28px] border-b-[2px] rounded-lg bg-gray-200", (comment?.replies?.length ?? 0) === 0 ? 'bottom-8' : 'bottom-16')}></div>}
            {/* Comment nội dung */}
            <div className="relative flex items-start gap-x-2">
                {comment.parentCommentId && (
                    <div className="absolute -left-[24px] w-7 top-[0px] h-[20px] bg-transparent border-b-[2px] border-l-[2px] rounded-bl-lg border-gray-200"></div>
                )}
                <Avatar className="flex-shrink-0" src={comment.user.avatar ?? images.user} />
                <div className="flex flex-col gap-y-2">
                    <div className={cn("py-2 rounded-2xl flex flex-col items-start", comment.content ? 'bg-gray-100 px-4' : '-mt-1')}>
                        <span className="font-semibold">{comment?.user?.fullName}</span>
                        <p className="text-left flex items-center gap-x-1">
                            {comment.replyToUserId && <button className="font-bold rounded-lg text-sm">{comment.replyToUserName}</button>}
                            {comment.content}
                        </p>
                    </div>
                    {comment.mediaType === MediaType.IMAGE && comment.mediaUrl && <Image preview={{
                        mask: 'Xem'
                    }}
                        width='120px'
                        height='120px'
                        className="object-contain overflow-hidden bg-black"
                        src={comment.mediaUrl} />
                    }

                    {comment.mediaType === MediaType.VIDEO && comment.mediaUrl && <video
                        src={comment.mediaUrl}
                        className="w-[120px] h-[120px] object-contain bg-black"
                        controls
                    />}

                    <div className="flex items-center gap-x-4 px-2">
                        <span className="text-xs">{comment.status === 'pending' ? 'Đang viết': formatTime(new Date(comment.sentAt))}</span>
                        <button
                            disabled={comment.status === 'pending'}
                            className="text-xs hover:underline"
                            onClick={() => {
                                setIsReplying(true)
                                if (level <= 2) {
                                    setReplyToUser(comment.user)
                                } else {
                                    onReply?.(comment)
                                }
                            }}
                        >
                            Phản hồi
                        </button>
                    </div>
                </div>

                {/* LINE */}
                {isReplying && !comment.isHaveChildren && level < 3 && <div className="absolute left-4 w-[66px] top-[31px] h-full bg-transparent border-l-[2px] border-gray-200"></div>}
            </div>

            {comment.isHaveChildren && (comment?.replies?.length ?? 0) === 0 && <>
                <div className={cn("absolute left-8 border-gray-200 border-l-[2px] border-b-[2px] w-6 h-1/2", comment.parentCommentId ? "bottom-[26px] rounded-bl-lg" : "bottom-[19px] rounded-bl-xl")}></div>
                <button onClick={() => {
                    setIsReplying(true)
                    handleFetchReplies(comment.id, pagination.page, pagination.size)
                }} className="font-semibold text-left pl-11 text-xs">Xem các phản hồi</button>
            </>}

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
                            updatedComments={updatedComments}
                            level={level + 1}
                            onReply={(comment) => {
                                if (level + 1 > 2) {
                                    setReplyToUser(comment.user)
                                }
                            }}
                        />
                    ))}

                    {pagination.hasMore && <button onClick={() => handleFetchReplies?.(comment.id, pagination.page + 1, pagination.size)} className="font-semibold text-left pl-6 mb-2 text-xs">Xem thêm phản hồi</button>}

                    {/* Box phản hồi ở cuối nếu đang reply comment này */}
                    {isReplying && (
                        <>
                            <div className="absolute left-4 w-[28px] -top-[24px] h-full bg-transparent border-l-[2px] border-b-[2px] rounded-bl-lg border-gray-200"></div>
                            <div className={cn(level === 3 ? "pl-0" : "pl-4")}>
                                <BoxReplyComment value={commentData.content}
                                    onContentChange={(newValue) => setCommentData({
                                        ...commentData,
                                        content: newValue
                                    })}
                                    replyToUsername={replyToUser?.fullName}
                                    files={commentData.fileList}
                                    onFileChange={(file) => setCommentData({
                                        ...commentData,
                                        fileList: [file]
                                    })}
                                    onSubmit={(values => handleReplyComment(values, comment.id))}
                                />
                            </div>
                        </>
                    )}

                </div>
            )}

            {/* Nếu không có comment con, hiển thị box reply trực tiếp dưới comment */}
            {isReplying && !comment.isHaveChildren && level < 3 && (
                <div className="relative">
                    <div className="absolute left-4 w-[24px] -top-[25px] h-full bg-transparent border-l-[2px] border-b-[2px] rounded-bl-lg border-gray-200"></div>
                    <div className={cn(level === 3 ? "pl-0" : "pl-10")}>
                        <BoxReplyComment value={commentData.content}
                            onContentChange={(newValue) => setCommentData({
                                ...commentData,
                                content: newValue
                            })}
                            replyToUsername={replyToUser?.fullName}
                            files={commentData.fileList}
                            onFileChange={(file) => setCommentData({
                                ...commentData,
                                fileList: [file]
                            })}
                            onSubmit={(values => handleReplyComment(values, comment.id))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};


