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
import { ChatRoomResource } from "../../types/chatRoom";
import chatRoomService from "../../services/chatRoomService";

const Navbar: FC = () => {
    const { user } = useSelector(selectAuth);

    // NOTIFICATION SECTION
    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState<NotificationResource[]>([])
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

    // CHATROOM SECTION
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);
    const [chatRoomLoading, setChatRoomLoading] = useState(false);

    // NOTIFICATION
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

    // CHATROOM

    const fetchChatRooms = async () => {
        setChatRoomLoading(true)
        const response = await chatRoomService.getAllChatRooms();
        setChatRoomLoading(false)
        if (response.isSuccess) {
            setChatRooms(response.data)
        }
    }

    useEffect(() => {
        fetchChatRooms()
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
    }, [])

    return <div className="flex items-center gap-x-2 md:gap-x-3 flex-shrink-0">
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
                <button className="p-[10px] md:p-3 rounded-md bg-gray-100">
                    <Bell className="text-gray-500 md:hidden" size={15} />
                    <Bell className="hidden md:block text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Badge count={chatRooms.filter(c => !c.isRead).length}>
            <Popover trigger='click' placement="bottomRight" content={<MessengerDialog
                chatRooms={chatRooms}
                loading={chatRoomLoading}
                setLoading={setChatRoomLoading}
                onFetchChatRooms={fetchChatRooms}
                onUpdateChatRooms={(chatRooms) => setChatRooms(chatRooms)}
            />}>
                <button className="p-[10px] md:p-3 rounded-md bg-gray-100">
                    <MessageSquare className="text-gray-500 md:hidden" size={15} />
                    <MessageSquare className="hidden md:block text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Popover trigger='click' className="flex-shrink-0" placement="bottomRight" content={<AccountDialog />}>
            <div className="relative">
                <button className="border-[1px] border-gray-300 rounded-full overflow-hidden">
                    <img className='object-cover w-[30px] h-[30px] md:w-[36px] md:h-[36px]' src={user?.avatar ?? images.user} />
                </button>
                <button className="absolute right-0 bottom-0 p-[1px] rounded-full border-[1px] bg-gray-50 border-gray-200">
                    <ChevronDown className="text-gray-500 font-bold" size={14} />
                </button>
            </div>
        </Popover>

    </div>
};

export default Navbar;
