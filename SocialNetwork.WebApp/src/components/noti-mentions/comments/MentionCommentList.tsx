import { useEffect, useRef } from "react";
import { CommentResource } from "../../../types/comment";
import { CommentMentionPagination } from "../../../utils/pagination";
import { BoxReplyCommentType } from "../../comments/BoxReplyComment";
import { MentionCommentItem } from "./MentionCommentItem";

type MentionCommentListProps = {
    comments: CommentResource[];
    pagination: CommentMentionPagination;
    activeCommentId: string;
    replyComment: (values: BoxReplyCommentType, parentCommentId: string | null, replyToUserId: string | undefined, level: number) => void
    onFetchReplies?: (commentId: string) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[], isPrev: boolean) => void;
    onFetchNextPage: (parentCommentId: null | string, page: number) => void;
    onFetchPrevPage: (parentCommentId: null | string, page: number) => void
}

export const MentionCommentList: React.FC<MentionCommentListProps> = ({
    comments,
    activeCommentId,
    replyComment,
    pagination,
    onFetchReplies,
    updatedComments,
    onFetchNextPage,
    onFetchPrevPage
}) => {

    const mentionCommentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mentionCommentRef.current) {
            mentionCommentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
            
    }, [activeCommentId])

    return (
        <div className="flex flex-col gap-y-3 py-4">
            {pagination.havePrevPage && <button onClick={() => onFetchPrevPage(null, pagination.prevPage - 1)} className="text-xs font-semibold text-center pl-6 mb-2">Xem các bình luận trước đó...</button>}
            
            {comments.map((comment) => (
                <MentionCommentItem
                    ref={mentionCommentRef}
                    parentComment={null}
                    key={comment.id}
                    comment={comment}
                    level={1}
                    onFetchReplies={onFetchReplies}
                    updatedComments={updatedComments}
                    replyComment={replyComment}
                    activeCommentId={activeCommentId}
                />
            ))}

            {pagination.haveNextPage && <button onClick={() => onFetchNextPage(null, pagination.nextPage + 1)} className="text-xs font-semibold text-center pl-6 mt-2">Xem thêm các bình luận khác...</button>}
        </div>
    );
};

