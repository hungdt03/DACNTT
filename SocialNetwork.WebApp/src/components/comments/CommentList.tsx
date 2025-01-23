import { CommentResource } from "../../types/comment";
import { Pagination } from "../../types/response";
import { CommentItem } from "./CommentItem";
import { BoxReplyCommentType } from "./BoxReplyComment";
import CommentSkeleton from "../skeletons/CommentSkeleton";

type CommentListProps = {
    loading: boolean;
    comments: CommentResource[];
    pagination: Pagination;
    replyComment: (values: BoxReplyCommentType, parentCommentId: string | null, replyToUserId: string | undefined, level: number) => void
    onFetchReplies?: (commentId: string) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[]) => void;
    fetchNextPage: (page: number, size: number) => void;
    onDeleteComment: (commentId: string) => void
}


export const CommentList: React.FC<CommentListProps> = ({
    loading,
    comments,
    replyComment,
    pagination,
    onFetchReplies,
    updatedComments,
    fetchNextPage,
    onDeleteComment
}) => {

    return (
        <div className="flex flex-col gap-y-3 py-4">
            {comments.map((comment) => (
                <CommentItem
                    parentComment={null}
                    key={comment.id}
                    comment={comment}
                    level={1}
                    onFetchReplies={onFetchReplies}
                    updatedComments={updatedComments}
                    replyComment={replyComment}
                    onDeleteComment={onDeleteComment}
                />

            ))}

            {loading && <CommentSkeleton />}

            {!loading && pagination.hasMore && <button onClick={() => fetchNextPage(pagination.page + 1, pagination.size)} className="text-center text-xs font-semibold mt-2">Tải thêm bình luận...</button>}
        </div>
    );
};

