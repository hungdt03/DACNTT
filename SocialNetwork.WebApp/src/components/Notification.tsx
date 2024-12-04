import { Avatar, Popover } from "antd";
import { FC, useState } from "react";
import images from "../assets";
import { Check, Delete, MoreHorizontal } from "lucide-react";
import { NotificationResource } from "../types/notification";
import { formatTime } from "../utils/date";
import cn from "../utils/cn";

type NotificationMoreActionProps = {
    onMarkAsRead?: () => void;
    onDelete?: () => void;
    isRead: boolean;
}

const NotificationMoreAction: FC<NotificationMoreActionProps> = ({
    onMarkAsRead,
    onDelete,
    isRead
}) => {
    return <div className="flex flex-col items-start rounded-md">
        {!isRead && <button onClick={onMarkAsRead} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Check size={17} className="text-gray-500" />
            Đánh dấu là đã đọc
        </button>}
        <button onClick={onDelete} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Delete size={17} className="text-gray-500" />
            Xóa thông báo
        </button>
    </div>
}

type NotificationProps = {
    notification: NotificationResource;
    onDelete?: () => void;
    onMarkAsRead?: () => void;
}

const Notification: FC<NotificationProps> = ({
    notification,
    onDelete,
    onMarkAsRead
}) => {
    const [showMoreAction, setShowMoreAction] = useState(false);

    return <div onMouseOver={() => setShowMoreAction(true)} onMouseLeave={() => setShowMoreAction(false)} className={cn("relative flex items-center gap-x-3 px-3 py-2 rounded-md hover:bg-gray-100 max-w-[400px]", !notification.isRead && 'bg-gray-50')}>
        <Avatar className="flex-shrink-0" size='large' src={notification.imageUrl ?? images.user} />
        <div className="flex flex-col items-start">
            <div className="flex-1 line-clamp-2">
                {notification.content}
            </div>
            <span className={cn("text-gray-500 text-xs font-semibold px-1", !notification.isRead && 'text-primary')}>{formatTime(new Date(notification.dateSent))}</span>
        </div>

        {showMoreAction && <Popover trigger='click' content={<NotificationMoreAction
            isRead={notification.isRead}
            onDelete={onDelete}
            onMarkAsRead={onMarkAsRead}
        />}>
            <button className="absolute top-1/2 -translate-y-1/2 right-4 bg-white shadow transition-all ease-linear duration-100 border-[1px] border-gray-200 w-6 h-6 flex items-center justify-center rounded-full">
                <MoreHorizontal className="text-gray-400" size={16} />
            </button>
        </Popover>}
    </div>
};

export default Notification;
