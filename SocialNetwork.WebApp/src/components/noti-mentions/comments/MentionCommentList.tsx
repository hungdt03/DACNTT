import { useEffect, useState } from "react";
import { CommentResource } from "../../../types/comment";
import { CommentMentionPagination } from "../../../utils/pagination";
import { BoxReplyCommentType } from "../../comments/BoxReplyComment";
import { MentionCommentItem } from "./MentionCommentItem";
import { PostResource } from "../../../types/post";
import { GroupResource } from "../../../types/group";
import CommentSkeleton from "../../skeletons/CommentSkeleton";
import reportService from "../../../services/reportService";
import { message, Modal } from "antd";
import useModal from "../../../hooks/useModal";
import ReportPostModal from "../../modals/reports/ReportPostModal";

type MentionCommentListProps = {
    post: PostResource;
    group?: GroupResource;
    loading: boolean;
    comments: CommentResource[];
    pagination: CommentMentionPagination;
    activeCommentId?: string;
    replyComment: (values: BoxReplyCommentType, parentCommentId: string | null, replyToUserId: string | undefined, level: number) => void
    onFetchReplies?: (commentId: string) => void;
    updatedComments: (commentId: string, fetchedReplies: CommentResource[], isPrev: boolean) => void;
    onFetchNextPage: (parentCommentId: null | string, page: number) => void;
    onFetchPrevPage: (parentCommentId: null | string, page: number) => void;
    onDeleteComment: (commentId: string) => void
}

export const MentionCommentList: React.FC<MentionCommentListProps> = ({
    post,
    group,
    loading,
    comments,
    activeCommentId,
    replyComment,
    pagination,
    onFetchReplies,
    updatedComments,
    onFetchNextPage,
    onFetchPrevPage,
    onDeleteComment
}) => {
    const [reason, setReason] = useState('');
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal();
    const { handleCancel: cancelAdmin, handleOk: okAdmin, isModalOpen: openAdmin, showModal: showAdmin } = useModal();
    const [commentId, setCommentId] = useState<string>();

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const commentElement = document.getElementById('comment-id-' + activeCommentId);
            if (commentElement) {
                commentElement.scrollIntoView({ behavior: 'smooth' });
                observer.disconnect(); // Ngừng theo dõi sau khi đã scroll
            }
        });

        const commentList = document.getElementById('comment-list');
        if (commentList) {
            observer.observe(commentList, { childList: true, subtree: true });
        }

        return () => observer.disconnect(); // Cleanup khi component unmount
    }, [activeCommentId]);


    const handleReportComment = async (commentId: string, reason: string) => {
        const response = await reportService.reportComment(commentId, reason, group?.id);
        if (response.isSuccess) {
            message.success(response.message)
            handleOk()
            setReason('')
        } else {
            message.error(response.message)
        }
    }


    return (<>
        <div id='comment-list' className="flex flex-col gap-y-3 py-4">
            {pagination.havePrevPage && <button onClick={() => onFetchPrevPage(null, pagination.prevPage - 1)} className="text-xs font-semibold text-center pl-6 mb-2">Xem các bình luận trước đó...</button>}

            {comments.map((comment) => (
                <MentionCommentItem
                    post={post}
                    group={group}
                    parentComment={null}
                    key={comment.id}
                    comment={comment}
                    level={1}
                    onFetchReplies={onFetchReplies}
                    updatedComments={updatedComments}
                    replyComment={replyComment}
                    activeCommentId={activeCommentId}
                    onDeleteComment={onDeleteComment}
                    onReportComment={() => {
                        setCommentId(comment.id)
                        showAdmin()
                    }}
                />
            ))}

            {loading && <CommentSkeleton />}
            {!loading && pagination.haveNextPage && <button onClick={() => onFetchNextPage(null, pagination.nextPage + 1)} className="text-xs font-semibold text-center pl-6 mt-2">Xem thêm các bình luận khác...</button>}
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
    </>);
};

