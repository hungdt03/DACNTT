import { FC, useEffect, useState } from "react";
import { CommentResource } from "../../../types/comment";
import commentService from "../../../services/commentService";
import images from "../../../assets";
import { Avatar, Image } from "antd";
import cn from "../../../utils/cn";
import { formatTime } from "../../../utils/date";
import { MediaType } from "../../../enums/media";
import { UserResource } from "../../../types/user";
import { Link } from "react-router-dom";
import BoxReplyComment, { BoxReplyCommentType, NodeContent } from "../../comments/BoxReplyComment";
import { CommentMentionPagination } from "../../../utils/pagination";
import { Pagination } from "../../../types/response";

type MentionCommentItemProps = {
    activeCommentId?: string;
    parentComment: CommentResource | null;
    comment: CommentResource;
    level: number;
    onReply?: (comment: CommentResource) => void;
    onExpandLine?: (comment: CommentResource) => void;
    updatePagination?: (page: number, size: number, hasMore: boolean) => void;
    onFetchReplies?: (commentId: string, page: number, size: number) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[], isPrev: boolean) => void;
    replyComment: (values: BoxReplyCommentType, parentCommentId: string | null, replyToUserId: string | undefined, level: number) => void
}

const extractContentFromJSON = (commentJSON: string): JSX.Element => {
    try {
        const nodeContents = JSON.parse(commentJSON) as NodeContent[];

        return (
            <>
                {nodeContents.map((item, index) => {
                    if (item.id) {
                        return (
                            <Link
                                key={index + item.id}
                                to={`/profile/${item.id}`}
                                style={{ fontWeight: 'bold' }}
                                className="hover:text-black"
                            >
                                {item.content}
                            </Link>
                        );
                    } else {
                        return <span key={index + item.content}>{item.content || ' '}</span>;
                    }
                })}
            </>
        );
    } catch (e) {
        return <>{commentJSON}</>;
    }
};

export const MentionCommentItem: FC<MentionCommentItemProps> = (
    (
        {
            activeCommentId,
            comment,
            replyComment,
            onFetchReplies,
            updatedComments,
            level,
            onReply,
            onExpandLine
        },
    ) => {
        const [isReplying, setIsReplying] = useState(false)
        const [replyToUser, setReplyToUser] = useState<UserResource>(comment.user);
        const [content, setContent] = useState<string>('')
        const [expandLine, setExpandLine] = useState(false)

        const [pagination, setPagination] = useState<CommentMentionPagination>({
            prevPage: 1,
            nextPage: 1,
            haveNextPage: false,
            havePrevPage: false
        })

        const [replyPagination, setReplyPagination] = useState<Pagination>({
            page: 1,
            size: 5,
            hasMore: false
        })

        const handleFetchReplies = async (commentId: string, page: number, size: number) => {
            const response = await commentService.getAllRepliesByCommentId(commentId, page, size);
            if (response.isSuccess) {
                const fetchedReplies = response.data;
                setReplyPagination(response.pagination)
                updatedComments(commentId, fetchedReplies, false)
            }
        }

        const fetchPrevComments = async (parentCommentId: string, page: number) => {
            const response = await commentService.getPrevComments(comment.postId, parentCommentId, page);
            if (response.isSuccess) {
                setPagination(prevPagination => ({
                    ...prevPagination,
                    prevPage: response.pagination.prevPage,
                    havePrevPage: response.pagination.havePrevPage
                }))

                updatedComments(parentCommentId, response.data, true)
            }
        }

        const fetchNextComments = async (parentCommentId: string, page: number) => {
            const response = await commentService.getNextComments(comment.postId, parentCommentId, page);
            if (response.isSuccess) {
                setPagination(prevPagination => ({
                    ...prevPagination,
                    nextPage: response.pagination.nextPage,
                    haveNextPage: response.pagination.haveNextPage
                }))

                updatedComments(parentCommentId, response.data, false)
            }
        }


        const handleReplyComment = (values: BoxReplyCommentType, parentCommentId: string | null) => {
            replyComment(values, parentCommentId, replyToUser?.id, level);
        }


        useEffect(() => {
            if (comment.pagination) {
                setPagination(comment.pagination)
            }
        }, [])

        return (
            <div className={cn("relative flex flex-col pl-4", comment.parentCommentId !== null ? "gap-y-5" : "gap-y-3")}>
                {/* Comment nội dung */}
                <div id={`comment-id-${comment.id}`} className="relative flex items-start gap-x-2">
                    <Avatar className="flex-shrink-0" src={comment.user.avatar ?? images.user} />
                    <div className="flex flex-col gap-y-2">
                        <div
                            className={cn(
                                "py-2 rounded-2xl flex flex-col items-start",
                                comment.id === activeCommentId
                                    ? "bg-sky-100 px-4"
                                    : comment.content
                                        ? "bg-gray-100 px-4"
                                        : "-mt-1"
                            )}
                        >
                            <span className="font-semibold">{comment?.user?.fullName}</span>
                            <p className="text-left overflow-hidden break-words break-all">
                                {extractContentFromJSON(comment.content)}
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
                            <span className="text-xs">{comment.status === 'pending' ? 'Đang viết' : formatTime(new Date(comment.sentAt))}</span>
                            <button
                                disabled={comment.status === 'pending'}
                                className="text-xs hover:underline"
                                onClick={() => {
                                    onExpandLine?.(comment)
                                    if (level <= 2) {
                                        setIsReplying(true)
                                        const userJson = JSON.stringify(comment.user);
                                        setReplyToUser(JSON.parse(userJson))
                                    } else {
                                        onReply?.(comment)
                                    }
                                }}
                            >
                                Phản hồi
                            </button>
                        </div>
                    </div>

                </div>

                {comment.isHaveChildren && (comment?.replies?.length ?? 0) === 0 && <>
                    <button onClick={() => {
                        setIsReplying(true)
                        handleFetchReplies(comment.id, replyPagination.page, replyPagination.size)
                    }} className="font-semibold text-left my-1 pl-11 text-xs">Xem các phản hồi...</button>
                </>}

                {/* Render comment con */}
                {comment.isHaveChildren && (comment?.replies?.length ?? 0) > 0 && (
                    <div className="relative flex flex-col gap-y-3 pl-6">
                        {pagination?.havePrevPage && <button onClick={() => fetchPrevComments(comment.id, pagination.prevPage - 1)} className="font-semibold text-left pl-16 mt-2 mb-2 text-xs">Xem các phản hồi trước đó ...</button>}

                        {comment?.replies?.map((child) => (
                            <MentionCommentItem
                                activeCommentId={activeCommentId}
                                parentComment={comment}
                                key={child.id}
                                comment={child}
                                onFetchReplies={onFetchReplies}
                                replyComment={replyComment}
                                updatedComments={updatedComments}
                                level={level + 1}
                                onReply={(comment) => {
                                    if (level + 1 > 2) {
                                        setIsReplying(true)
                                        const userJson = JSON.stringify(comment.user);
                                        setReplyToUser(JSON.parse(userJson))
                                    }
                                }}
                                onExpandLine={(expandComment) => {
                                    console.log(expandComment)
                                    const commentIndex = comment.replies.findIndex(cmt => cmt.id === expandComment.id);
                                    if (commentIndex === comment.replies.length - 1) {
                                        setExpandLine(true)
                                    }
                                }}
                            />
                        ))}

                        {pagination?.haveNextPage && <button onClick={() => fetchNextComments(comment.id, pagination.nextPage + 1)} className="font-semibold text-left pl-16 mt-2 mb-2 text-xs">Xem thêm các phản hồi khác ...</button>}
                        {replyPagination?.hasMore && <button onClick={() => handleFetchReplies(comment.id, replyPagination.page + 1, replyPagination.size)} className="font-semibold text-left pl-16 mt-2 mb-2 text-xs">Xem thêm các phản hồi khác ...</button>}

                        {/* Box phản hồi ở cuối nếu đang reply comment này */}
                        {isReplying && (
                            <>
                                <div className={cn(level === 3 ? "pl-0" : "pl-4")}>
                                    <BoxReplyComment
                                        value={content}
                                        onChange={(newValue) => setContent(newValue)}
                                        replyToUsername={replyToUser}
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
                        <div className={cn(level === 3 ? "pl-0" : "pl-10")}>
                            <BoxReplyComment
                                replyToUsername={replyToUser}
                                onSubmit={(values => handleReplyComment(values, comment.id))}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    })


