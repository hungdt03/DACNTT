import { CommentResource } from "../../types/comment";
import { Pagination } from "../../types/response";
import { BoxReplyCommentType } from "../comments/BoxReplyComment";
import { HighlightCommentItem } from "./HighlightCommentItem";

type HighlightCommentListProps = {
    comments: CommentResource[];
    pagination: Pagination;
    activeCommentId: string;
    replyComment: (values: BoxReplyCommentType, parentCommentId: string | null, replyToUserId: string | undefined, level: number) => void
    onFetchReplies?: (commentId: string) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[]) => void;
    fetchNextPage: (page: number, size: number) => void;
}

export const HighlightCommentList: React.FC<HighlightCommentListProps> = ({
    comments,
    activeCommentId,
    replyComment,
    pagination,
    onFetchReplies,
    updatedComments,
    fetchNextPage,
}) => {
   

    return (
        <div className="flex flex-col gap-y-3 py-4">
            {comments.map((comment) => (
                <HighlightCommentItem
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

            {pagination.hasMore && <button onClick={() => fetchNextPage(pagination.page + 1, pagination.size)} className="text-center text-xs font-semibold mb-4">Tải thêm bình luận</button>}
        </div>
    );
};

