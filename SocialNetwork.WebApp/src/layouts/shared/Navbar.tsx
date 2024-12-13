import { Bell, MessageSquare } from "lucide-react";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Badge, Popover } from "antd";
import NotificationDialog from "../../components/dialogs/NotificationDialog";
import MessengerDialog from "../../components/dialogs/MessengerDialog";
import { NotificationResource } from "../../types/notification";
import notificationService from "../../services/notificationService";
import { toast } from "react-toastify";
import SignalRConnector from '../../app/signalR/signalr-connection'
import { inititalValues } from "../../utils/pagination";
import { Pagination } from "../../types/response";

const Navbar: FC = () => {
    const [notifications, setNotifications] = useState<NotificationResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const { events } = SignalRConnector()

    const fetchNotifications = async (page: number) => {
        const response = await notificationService.getAllNotifications({ page, size: pagination.size });
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

        events(undefined, (notification: NotificationResource) => {
            toast.info(notification.content);
            setNotifications(prev => [notification, ...prev])
        })

    }, [])

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

    return <div className="flex items-center gap-x-3">
        {/* <Badge count={2}>
            <Popover trigger='click' placement="topRight" content={<NotificationDialog />}>
                <button className="p-3 rounded-md bg-gray-100">
                    <Menu className="text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge> */}
        <Badge count={notifications.filter(n => !n.isRead).length}>
            <Popover trigger='click' placement="topRight" content={<NotificationDialog onFetchMore={(nextPage) => fetchNotifications(nextPage)} pagination={pagination} onMarkAsRead={handleMarkNotificationAsRead} onDelete={handleDeleteNotification} notifications={notifications} />}>
                <button className="p-3 rounded-md bg-gray-100">
                    <Bell className="text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Badge count={3}>
            <Popover trigger='click' content={<MessengerDialog />}>
                <button className="p-3 rounded-md bg-gray-100">
                    <MessageSquare className="text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <div>
            <img width='36px' height='36px' src={images.user} />
        </div>
    </div>
};

export default Navbar;
