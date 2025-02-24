import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { Badge, Popover } from "antd";
import AdminAccountDialog from "./AdminAccountDialog";
import { Bell, ChevronDown } from "lucide-react";
import images from "../../../assets";
import { NotificationResource } from "../../../types/notification";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import notificationService from "../../../services/notificationService";
import SignalRConnector from '../../../app/signalR/signalr-connection'
import { toast } from "react-toastify";
import NotificationDialog from "../../../components/dialogs/NotificationDialog";

const AdminNavbar: FC = () => {
    const { user } = useSelector(selectAuth);

    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState<NotificationResource[]>([])
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

    const fetchMoreNotificatiions = async () => {
        if (!pagination.hasMore || loading) return;
        fetchNotifications(pagination.page + 1)
    }

    const fetchNotifications = async (page: number) => {
        setLoading(true)
        const response = await notificationService.getAllNotifications({ page, size: pagination.size })
        setLoading(false)
        if (response.isSuccess) {
            setNotifications((prev) => {
                const newNotifications = response.data.filter(
                    (notification) => !prev.some((n) => n.id === notification.id)
                )
                return [...prev, ...newNotifications]
            })
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchNotifications(pagination.page)
        SignalRConnector.events(
            undefined,
            undefined,
            undefined,
            undefined,
            // ON NOTIFICATION RECEIVED
            (notification: NotificationResource) => {
                toast.info(notification.content)
                setNotifications((prev) => [notification, ...prev])
            }
        )

        return () => SignalRConnector.unsubscribeEvents()
    }, [])

    return <div className="flex items-center gap-x-4">
        <Badge count={notifications.filter(n => !n.isRead).length}>
            <Popover trigger='click' placement="topRight" content={<NotificationDialog
                notifications={notifications}
                pagination={pagination}
                isInitialLoadComplete={isInitialLoadComplete}
                loading={loading}
                onFetchNextPage={fetchMoreNotificatiions}
                onFinishInitialLoad={() => {
                    setIsInitialLoadComplete(true)
                    fetchMoreNotificatiions()
                }}
                onUpdateNotifications={(notifications) => setNotifications(notifications)}
            />}>
                <button className="p-[10px] md:p-3 rounded-full bg-gray-50 hover:bg-gray-100">
                    <Bell className="block text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Popover trigger='click' placement='bottomRight' content={<AdminAccountDialog />}>
            <div className='relative'>
                <button className='border-[1px] border-gray-300 rounded-full overflow-hidden'>
                    <img className='object-cover w-[38px] h-[38px]' src={user?.avatar ?? images.user} />
                </button>
                <button className='absolute right-0 bottom-0 p-[1px] rounded-full border-[1px] bg-gray-50 border-gray-200'>
                    <ChevronDown className='text-gray-500 font-bold' size={14} />
                </button>
            </div>
        </Popover>
    </div>
};

export default AdminNavbar;
