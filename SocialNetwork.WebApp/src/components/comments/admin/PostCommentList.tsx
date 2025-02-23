import { CommentResource } from "../../../types/comment";
import { Pagination } from "../../../types/response";
import CommentSkeleton from "../../skeletons/CommentSkeleton";
import { GroupResource } from "../../../types/group";
import { PostResource } from "../../../types/post";
import { PostCommentItem } from "./PostCommentItem";

type PostCommentListProps = {
    post: PostResource
    group?: GroupResource
    loading: boolean;
    comments: CommentResource[];
    pagination: Pagination;
    onFetchReplies?: (commentId: string) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[]) => void;
    fetchNextPage: (page: number, size: number) => void;
    onDeleteComment: (commentId: string) => void
}


export const PostCommentList: React.FC<PostCommentListProps> = ({
    post,
    group,
    loading,
    comments,
    pagination,
    onFetchReplies,
    updatedComments,
    fetchNextPage,
    onDeleteComment,
}) => {

    return <div className="flex flex-col gap-y-3">
       
        {comments.map((comment) => (
            <PostCommentItem
                post={post}
                group={group}
                parentComment={null}
                key={comment.id}
                comment={comment}
                level={1}
                onFetchReplies={onFetchReplies}
                updatedComments={updatedComments}
                onDeleteComment={onDeleteComment}
            />
        ))}

        {loading && <CommentSkeleton />}

        {!loading && pagination.hasMore && <button onClick={() => fetchNextPage(pagination.page + 1, pagination.size)} className="text-center text-xs font-semibold mt-2">Tải thêm bình luận...</button>}
    </div>

};

