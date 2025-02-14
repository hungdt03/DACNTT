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

    const [countUnreadChatRoom, setCountUnreadChatRoom] = useState<number>(0)
    const [countUnreadNotification, setCountUnreadNotification] = useState<number>(0)

    return <div className="flex items-center gap-x-2 md:gap-x-3">
        <Badge count={countUnreadNotification}>
            <Popover trigger='click' placement="topRight" content={<NotificationDialog
                onCountNotification={(count) => setCountUnreadNotification(count)}
            />}>
                <button className="p-[10px] md:p-3 rounded-md bg-gray-100">
                    <Bell className="text-gray-500 md:hidden" size={15} />
                    <Bell className="hidden md:block text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Badge count={countUnreadChatRoom}>
            <Popover trigger='click' placement="bottomRight" content={<MessengerDialog onCountChatRoom={count => setCountUnreadChatRoom(count)} />}>
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
