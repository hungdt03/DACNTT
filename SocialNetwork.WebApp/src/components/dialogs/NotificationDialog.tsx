import { FC, useEffect, useRef, useState } from "react";
import Notification from "../Notification";
import { NotificationResource } from "../../types/notification";
import { Empty, Modal } from "antd";
import { Pagination } from "../../types/response";
import useModal from "../../hooks/useModal";
import MentionPostModal from "../noti-mentions/comments/MentionPostModal";
import { NotificationType } from "../../enums/notification-type";
import MentionSharePostModal from "../noti-mentions/sharings/MentionSharePostModal";
import { useNavigate } from "react-router-dom";
import { inititalValues } from "../../utils/pagination";
import notificationService from "../../services/notificationService";
import SignalRConnector from '../../app/signalR/signalr-connection'
import { toast } from "react-toastify";
import NotificationSkeleton from "../skeletons/NotificationSkeleton";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

type NotificationDialogProps = {
    onCountNotification: (count: number) => void
}

const NotificationDialog: FC<NotificationDialogProps> = ({
    onCountNotification
}) => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const [notification, setNotification] = useState<NotificationResource>();
    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState<NotificationResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

    const navigate = useNavigate();

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchMoreNotificatiions(),
        hasMore: pagination.hasMore,
        loading,
        rootMargin: "50px",
        triggerId: "noti-scroll-trigger",
    });

    const fetchMoreNotificatiions = async () => {
        if (!pagination.hasMore || loading || !isInitialLoadComplete) return;
        fetchNotifications(pagination.page + 1);
    };

    const fetchNotifications = async (page: number) => {
        setLoading(true)
        const response = await notificationService.getAllNotifications({ page, size: pagination.size });
        setLoading(false)
        if (response.isSuccess) {
            setNotifications(prev => {
                const newNotifications = response.data.filter(
                    notification => !prev.some(n => n.id === notification.id)
                );
                return [...prev, ...newNotifications];
            });

            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchNotifications(pagination.page);

        SignalRConnector.events(
            undefined,
            undefined,
            undefined,
            undefined,
            // ON NOTIFICATION RECEIVED
            (notification: NotificationResource) => {
                toast.info(notification.content);
                setNotifications(prev => [notification, ...prev])
            }
        )
    }, [])

    useEffect(() => {
        onCountNotification(notifications.filter(noti => !noti.isRead).length)
    }, [notifications])

    const handleDeleteNotification = async (notificationId: string) => {
        const response = await notificationService.deleteNotification(notificationId);
        if (response.isSuccess) {
            setNotifications(prev => [...prev.filter(n => n.id !== notificationId)]);
            toast.success(response.message)
        }
    }

    const handleMarkNotificationAsRead = async (notificationId: string) => {
        const response = await notificationService.markNotificationAsRead(notificationId);
        if (response.isSuccess) {
            setNotifications(prev => {
                return prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                );
            });

        } else {
            toast.error(response.message)
        }
    }

    const handleOpenMentionComment = (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        setNotification(notification)
        showModal()
    }

    const handleOpenMentionShare = (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        setNotification(notification)
        showModal()
    }

    const handleRedirectToStoryPage = (notification: NotificationResource) => {
        const notiId = notification.id;
        const storyId = notification.storyId;
        const userId = notification.recipient.id;

        handleMarkNotificationAsRead(notification.id)
        navigate(`/stories/${userId}?noti_id=${notiId}&story_id=${storyId}`)
    }

    const handleRedirectToProfileSenderPage = async (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        navigate(`/profile/${notification.friendRequest.senderId}`)
    }

    const handleRedirectToProfileReceiverPage = async (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        navigate(`/profile/${notification.friendRequest.receiverId}`)
    }

    const handleRedirectToGroupPage = async (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        navigate(`/groups/${notification.groupId}`)
    }

    return <>
        <div ref={containerRef} className="flex flex-col gap-y-3 pt-2 px-2 max-h-[600px] min-w-[400px] overflow-y-auto custom-scrollbar">
            <span className="font-semibold text-lg">Thông báo của bạn</span>
            <div className="flex flex-col gap-y-2">
                {notifications.map(notification => (
                    <Notification
                        onShareNotification={() => handleOpenMentionShare(notification)}
                        onCommentNotification={() => handleOpenMentionComment(notification)}
                        onStoryNotification={() => handleRedirectToStoryPage(notification)}
                        onDelete={() => handleDeleteNotification(notification.id)}
                        onMarkAsRead={() => handleMarkNotificationAsRead(notification.id)}
                        key={notification.id}
                        notification={notification}
                        onRequestFriendNotification={() => handleRedirectToProfileSenderPage(notification)}
                        onAcceptRequestFriendNotification={() => handleRedirectToProfileReceiverPage(notification)}
                        onPostReactionNotification={() => handleOpenMentionComment(notification)}
                        onGroupNotification={() => handleRedirectToGroupPage(notification)}
                    />
                ))}

                {loading && <NotificationSkeleton />}
                <div id="noti-scroll-trigger" className="w-full h-1" />
                {notifications.length === 0 && !loading && (
                    <Empty description="Chưa có thông báo nào" />
                )}

                {!isInitialLoadComplete && !loading && pagination.hasMore && (
                    <button
                        className="w-full text-center text-sm py-1 bg-gray-200 rounded-md"
                        onClick={() => {
                            fetchNotifications(pagination.page + 1);
                            setIsInitialLoadComplete(true);
                        }}
                    >
                        Tải thêm ...
                    </button>
                )}
            </div>

        </div>

        {isModalOpen && <Modal
            style={{ top: 20 }}
            title={<p className="text-center font-bold text-lg">Bài viết được nhắc đến</p>}
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
            {(notification?.type.includes('COMMENT') || notification?.type === NotificationType.ASSIGN_POST_TAG || notification?.type === NotificationType.POST_REACTION && notification.postId) && <MentionPostModal postId={notification.postId} commentId={notification.commentId} />}
            {notification?.type === NotificationType.POST_SHARED && notification.postId && <MentionSharePostModal postId={notification.postId} />}
        </Modal>}
    </>
};

export default NotificationDialog;
