import { CommentResource } from "../../types/comment";
import { Pagination } from "../../types/response";
import { CommentItem } from "./CommentItem";
import { BoxReplyCommentType } from "./BoxReplyComment";
import CommentSkeleton from "../skeletons/CommentSkeleton";
import { GroupResource } from "../../types/group";
import { useState } from "react";
import { message, Modal } from "antd";
import useModal from "../../hooks/useModal";
import ReportPostModal from "../modals/reports/ReportPostModal";
import reportService from "../../services/reportService";
import { PostResource } from "../../types/post";

type CommentListProps = {
    post: PostResource
    group?: GroupResource
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
    post,
    group,
    loading,
    comments,
    replyComment,
    pagination,
    onFetchReplies,
    updatedComments,
    fetchNextPage,
    onDeleteComment,
}) => {
    const [reason, setReason] = useState('')

    const { handleCancel, handleOk, isModalOpen, showModal } = useModal();
    const { handleCancel: cancelAdmin, handleOk: okAdmin, isModalOpen: openAdmin, showModal: showAdmin } = useModal();
    const [commentId, setCommentId] = useState<string>()

    const handleReportComment = async (commentId: string, reason: string) => {
        const response = await reportService.reportComment(commentId, reason, group?.id);
        if(response.isSuccess) {
            message.success(response.message)
            handleOk()
            setReason('')
        } else {
            message.error(response.message)
        }
    }


    return <>
        <div className="flex flex-col gap-y-3 py-4">
            {comments.map((comment) => (
                <CommentItem
                    post={post}
                    group={group}
                    parentComment={null}
                    key={comment.id}
                    comment={comment}
                    level={1}
                    onFetchReplies={onFetchReplies}
                    updatedComments={updatedComments}
                    replyComment={replyComment}
                    onDeleteComment={onDeleteComment}
                    onReportComment={() => {
                        setCommentId(comment.id)
                        showAdmin()
                    }}
                />
            ))}

            {loading && <CommentSkeleton />}

            {!loading && pagination.hasMore && <button onClick={() => fetchNextPage(pagination.page + 1, pagination.size)} className="text-center text-xs font-semibold mt-2">Tải thêm bình luận...</button>}
        </div>

        {/* REPORT COMMENT TO ADMIN OF GROUP */}
        <Modal
            title={<p className="text-center font-bold text-lg">Báo cáo bình luận tới quản trị viên nhóm</p>}
            centered
            open={openAdmin}
            onOk={okAdmin}
            onCancel={cancelAdmin}
            okText='Gửi báo cáo'
            cancelText='Hủy'
            okButtonProps={{
                onClick: () => reason.trim().length >= 20 && commentId && void handleReportComment(commentId, reason),
                disabled: reason.trim().length < 20
            }}
        >
            <ReportPostModal
                value={reason}
                onChange={(newValue) => setReason(newValue)}
                title="Tại sao bạn báo cáo bình luận này"
                description="Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy tìm ngay sự giúp đỡ trước khi báo cáo với LinkUp."
            />
        </Modal>

          {/* REPORT COMMENT TO ADMIN OF GROUP */}
          <Modal
            title={<p className="text-center font-bold text-lg">Báo cáo bình luận</p>}
            centered
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Gửi báo cáo'
            cancelText='Hủy'
            okButtonProps={{
                onClick: () => reason.trim().length >= 20 && commentId && void handleReportComment(commentId, reason),
                disabled: reason.trim().length < 20
            }}
        >
            <ReportPostModal
                value={reason}
                onChange={(newValue) => setReason(newValue)}
                title="Tại sao bạn báo cáo bình luận này"
                description="Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy tìm ngay sự giúp đỡ trước khi báo cáo với LinkUp."
            />
        </Modal>
    </>
};

