import { Bell, ChevronDown, MessageSquare } from "lucide-react";
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
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import AccountDialog from "../../components/dialogs/AccountDialog";

const Navbar: FC = () => {
    const { user } = useSelector(selectAuth);

    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState<NotificationResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues)

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
        <Badge count={notifications.filter(n => !n.isRead).length}>
            <Popover trigger='click' placement="topRight" content={<NotificationDialog loading={loading} onFetchMore={(nextPage) => fetchNotifications(nextPage)} pagination={pagination} onMarkAsRead={handleMarkNotificationAsRead} onDelete={handleDeleteNotification} notifications={notifications} />}>
                <button className="p-3 rounded-md bg-gray-100">
                    <Bell className="text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Badge count={3}>
            <Popover trigger='click' placement="bottomRight" content={<MessengerDialog />}>
                <button className="p-3 rounded-md bg-gray-100">
                    <MessageSquare className="text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Popover trigger='click' placement="bottomRight" content={<AccountDialog />}>
            <div className="relative">
                <button className="border-[1px] border-gray-300 rounded-full overflow-hidden">
                    <img className='object-cover w-[38px] h-[38px]' src={user?.avatar ?? images.user} />
                </button>
                <button className="absolute right-0 bottom-0 p-[1px] rounded-full border-[1px] bg-gray-50 border-gray-200">
                    <ChevronDown className="text-gray-500 font-bold" size={14} />
                </button>
            </div>
        </Popover>

    </div>
};

export default Navbar;
