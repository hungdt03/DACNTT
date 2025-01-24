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

    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const navigate = useNavigate();

    const fetchNotifications = async (page: number) => {
        setLoading(true)
        const response = await notificationService.getAllNotifications({ page, size: pagination.size });
        setTimeout(() => setLoading(false), 500);

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

    useEffect(() => {
        if (!isInitialLoadComplete) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    pagination.hasMore && !loading && fetchNotifications(pagination.page + 1);
                }
            },
            { root: containerRef.current, rootMargin: '80px' }
        );

        observerRef.current = observer;

        const triggerElement = document.getElementById('noti-scroll-trigger');
        if (triggerElement) {
            observer.observe(triggerElement);
        }

        return () => {
            if (observerRef.current && triggerElement) {
                observer.unobserve(triggerElement);
            }
        };
    }, [pagination, isInitialLoadComplete, loading]);


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
        setNotification(notification)
        showModal()
    }

    const handleOpenMentionShare = (notification: NotificationResource) => {
        setNotification(notification)
        showModal()
    }

    const handleRedirectToStoryPage = (notification: NotificationResource) => {
        const notiId = notification.id;
        const storyId = notification.storyId;
        const userId = notification.recipient.id;

        navigate(`/stories/${userId}?noti_id=${notiId}&story_id=${storyId}`)
    }

    return <>
        <div ref={containerRef} className="flex flex-col gap-y-3 pt-2 px-2 max-h-[600px] min-w-[400px] overflow-y-auto custom-scrollbar">
            <span className="font-semibold text-lg">Thông báo của bạn</span>
            <div className="flex flex-col gap-y-2">
                {notifications.map(notification => (
                    <Notification
                        onShareNotification={() => handleOpenMentionShare(notification)}
                        onCommentNotification={() => handleOpenMentionComment(notification)}
                        onStoryReactionNotification={() => handleRedirectToStoryPage(notification)}
                        onDelete={() => handleDeleteNotification(notification.id)}
                        onMarkAsRead={() => handleMarkNotificationAsRead(notification.id)}
                        key={notification.id}
                        notification={notification}
                    />
                ))}

                {loading && <NotificationSkeleton />}
                <div id="noti-scroll-trigger" className="w-full h-1" />
                {notifications.length === 0 && !loading && (
                    <Empty description="Chưa có thông báo nào" />
                )}

                {!pagination.hasMore && !loading && notifications.length > 0 && (
                    <p className="text-center text-gray-500">Không còn thông báo nào để tải.</p>
                )}

                {!isInitialLoadComplete && !loading && pagination.hasMore && (
                    <button
                        className="w-full text-center text-sm"
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
            title={<p className="text-center font-semibold text-xl">Bài viết được nhắc đến</p>}
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
            {notification?.type.includes('COMMENT') && notification.postId && notification.commentId && <MentionPostModal postId={notification.postId} commentId={notification.commentId} />}
            {notification?.type === NotificationType.POST_SHARED && notification.postId && <MentionSharePostModal postId={notification.postId} />}
        </Modal>}
    </>
};

export default NotificationDialog;
