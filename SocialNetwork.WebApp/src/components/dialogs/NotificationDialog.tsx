import { FC, useState } from "react";
import Notification from "../Notification";
import { NotificationResource } from "../../types/notification";
import {  Empty, Modal } from "antd";
import { Pagination } from "../../types/response";
import useModal from "../../hooks/useModal";
import HighlightPostModal from "../hightlight/HighlightPostModal";
import ChatUserSkeleton from "../skeletons/ChatUserSkeleton";

type NotificationDialogProps = {
    notifications: NotificationResource[];
    loading: boolean;
    pagination: Pagination;
    onDelete?: (notificationId: string) => void;
    onMarkAsRead?: (notificationId: string) => void;
    onFetchMore: (nextPage: number) => void;
}

const NotificationDialog: FC<NotificationDialogProps> = ({
    notifications,
    loading,
    pagination,
    onDelete,
    onMarkAsRead,
    onFetchMore,
}) => {

    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const [postId, setPostId] = useState<string>();
    const [commentId, setCommentId] = useState<string>();

    const handleOpenPost = (notification: NotificationResource) => {
        setPostId(notification.postId)
        setCommentId(notification.commentId)
        showModal()
    }

    return <>
        <div className="flex flex-col gap-y-3 pt-2 px-2 max-h-[600px] min-w-[400px] overflow-y-auto custom-scrollbar">
            <span className="font-semibold text-lg">Thông báo của bạn</span>
            <div className="flex flex-col gap-y-2">
                {notifications.map(notification => <Notification onCommentNotification={() => handleOpenPost(notification)} onDelete={() => onDelete?.(notification.id)} onMarkAsRead={() => onMarkAsRead?.(notification.id)} key={notification.id} notification={notification} />)}
                {loading && <ChatUserSkeleton />}
                {pagination.hasMore && <button className="w-full text-center text-sm" onClick={() => onFetchMore(pagination.page + 1)}>Tải thêm ...</button>}
                {notifications.length === 0 && <Empty description='Chưa có thông báo nào' />}
            </div>
        </div>

        <Modal
            style={{ top: 20 }}
            title={<p className="text-center font-semibold text-xl">Bài viết của kkk</p>}
            width='700px'
            footer={[
            ]}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            classNames={{
                footer: 'hidden',
            }}
            styles={{
                body: {
                    padding: '0px',
                    paddingBottom: 20,

                },
                content: {
                    position: 'relative'
                },
                footer: {
                    display: 'none'
                },
            }}
        >
            {postId && commentId && <HighlightPostModal postId={postId} commentId={commentId} />}
        </Modal>
    </>
};

export default NotificationDialog;
