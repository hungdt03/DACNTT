import { useState } from "react";
import { CommentResource } from "../../types/comment";
import { BoxCommentType } from "./BoxSendComment";
import { Pagination } from "../../types/response";
import { CommentItem } from "./CommentItem";

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
    fetchNextPage,
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
                />

            ))}

            {pagination.hasMore && <button onClick={() => fetchNextPage(pagination.page + 1, pagination.size)} className="text-center text-xs font-semibold mb-4">Tải thêm bình luận</button>}
        </div>
    );
};

