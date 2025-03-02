import { useState } from "react";
import { CommentResource } from "../../../types/comment";
import { Pagination } from "../../../types/response";
import commentService from "../../../services/commentService";
import images from "../../../assets";
import { Avatar, Image } from "antd";
import cn from "../../../utils/cn";
import { formatTime } from "../../../utils/date";
import { MediaType } from "../../../enums/media";
import { Link } from "react-router-dom";
import CommentSkeleton from "../../skeletons/CommentSkeleton";
import { GroupResource } from "../../../types/group";
import { PostResource } from "../../../types/post";
import { NodeContent } from "../BoxReplyComment";

export const extractContentFromJSON = (commentJSON: string): JSX.Element => {
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
                                className="hover:text-black md:text-[13px] text-xs"
                            >
                                {item.content}
                            </Link>
                        );
                    } else {
                        return <span className="md:text-[13px] text-xs" key={index + item.content}>{item.content || ' '}</span>;
                    }
                })}
            </>
        );
    } catch (e) {
        return <>{commentJSON}</>;
    }
};

type PostCommentItemProps = {
    parentComment: CommentResource | null;
    comment: CommentResource;
    post: PostResource;
    group?: GroupResource;
    level: number;
    updatePagination?: (page: number, size: number, hasMore: boolean) => void;
    onFetchReplies?: (commentId: string, page: number, size: number) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[]) => void;
    onDeleteComment: (commentId: string) => void
}

export const PostCommentItem: React.FC<PostCommentItemProps> = ({
    comment,
    post,
    group,
    onFetchReplies,
    updatedComments,
    level,
    onDeleteComment,
}) => {
    const [isReplying, setIsReplying] = useState(false)
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        size: 6,
        hasMore: false
    })

    const handleFetchReplies = async (commentId: string, page: number, size: number) => {
        setLoading(true)
        const response = await commentService.getAllRepliesByCommentId(commentId, page, size);
        setLoading(false)
        if (response.isSuccess) {
            const fetchedReplies = response.data;
            setPagination(response.pagination)
            updatedComments(commentId, fetchedReplies)
        }
    }


    return (
        <div className={cn("relative flex flex-col pl-4", comment.parentCommentId !== null ? "gap-y-5" : "gap-y-3")}>
            {/* Comment nội dung */}
            <div className="relative flex items-start gap-x-2">
              
                <div className="relative">
                    {!comment.user.haveStory
                        ? <Avatar className="flex-shrink-0 w-[22px] h-[22px] md:w-[28px] md:h-[28px]" src={comment.user.avatar ?? images.user} />
                        : <Link className="p-[1px] border-[2px] inline-block border-primary rounded-full" to={`/stories/${comment.user.id}`}><Avatar className="flex-shrink-0 w-[22px] h-[22px] md:w-[28px] md:h-[28px]" src={comment.user.avatar ?? images.user} /> </Link>
                    }
                    {comment.user.isShowStatus && comment.user.isOnline && <div className="absolute -bottom-1 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                </div>
                <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-2 group">
                        <div className={cn("py-[6px] rounded-md flex flex-col items-start", comment.content ? 'bg-gray-100 px-3' : '-mt-1')}>
                            <Link to={`/profile/${comment.user.id}`} className="hover:text-black font-semibold text-xs md:text-[13px]">{comment?.user?.fullName}</Link>
                            <p className="text-left overflow-hidden break-words break-all">
                                {extractContentFromJSON(comment.content)}
                            </p>
                        </div>

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
                    </div>
                </div>

            </div>

            {comment.isHaveChildren && (comment?.replies?.length ?? 0) === 0 && <>
                <button onClick={() => {
                    setIsReplying(true)
                    handleFetchReplies(comment.id, pagination.page, pagination.size)
                }} className="font-semibold text-left pl-11 text-xs">Xem các phản hồi</button>
            </>}

            {/* Render comment con */}
            {comment.isHaveChildren && (
                <div className="relative flex flex-col gap-y-3 pl-6">
                    {comment?.replies?.map((child) => (
                        <PostCommentItem
                            onDeleteComment={onDeleteComment}
                            post={post}
                            group={group}
                            parentComment={comment}
                            key={child.id}
                            comment={child}
                            onFetchReplies={onFetchReplies}
                            updatedComments={updatedComments}
                            level={level + 1}
                        />
                    ))}

                    {loading && <CommentSkeleton />}

                    {!loading && pagination.hasMore && <button onClick={() => handleFetchReplies?.(comment.id, pagination.page + 1, pagination.size)} className="font-semibold text-left pl-16 my-2 text-xs">Xem thêm phản hồi...</button>}
                </div>
            )}
           
        </div>
    );
};


