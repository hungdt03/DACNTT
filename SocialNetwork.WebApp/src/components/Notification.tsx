import { Avatar, Button, Popover } from "antd";
import { FC, useState } from "react";
import images from "../assets";
import { Check, Delete, MoreHorizontal } from "lucide-react";
import { NotificationResource } from "../types/notification";
import { formatTime } from "../utils/date";
import cn from "../utils/cn";
import { NotificationType } from "../enums/notification-type";
import friendRequestService from "../services/friendRequestService";
import { toast } from "react-toastify";
import notificationService from "../services/notificationService";


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
    onCommentNotification: () => void
}

const Notification: FC<NotificationProps> = ({
    notification,
    onDelete,
    onMarkAsRead,
    onCommentNotification
}) => {
    const [showMoreAction, setShowMoreAction] = useState(false);
    const [accepted, setAccepted] = useState<'accepted' | 'cancel' | 'none'>('none');
    
    const handleCancelFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.cancelFriendRequest(requestId)
        if (response.isSuccess) {
            setAccepted('cancel')
            toast.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            toast.error(response.message);
            onDelete?.()
        }
    };

    const handleAcceptFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.acceptFriendRequest(requestId)
        if (response.isSuccess) {
            setAccepted('accepted')
            toast.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            toast.error(response.message)
            onDelete?.()
        }

       
    };

    const handleDeleteNotification = async (notificationId: string) => {
        const response = await notificationService.deleteNotification(notificationId);
    }

    const handleSelectNotification = () => {
        if(notification.type.includes('COMMENT')) {
            onCommentNotification()
        }
    }

    return <div onClick={handleSelectNotification} onMouseOver={() => setShowMoreAction(true)} onMouseLeave={() => setShowMoreAction(false)} className={cn("relative cursor-pointer flex items-center gap-x-3 px-3 py-2 rounded-md hover:bg-gray-100 max-w-[400px]", !notification.isRead && 'bg-gray-50')}>
        <Avatar className="flex-shrink-0" size='large' src={notification.imageUrl ?? images.user} />
        <div className="flex flex-col gap-y-3 items-start">
            <div className="flex flex-col items-start">
                <div className="flex-1 line-clamp-2">
                    {notification.content}
                </div>
                <span className={cn("text-gray-500 text-xs font-semibold", !notification.isRead && 'text-primary')}>{formatTime(new Date(notification.dateSent))}</span>
            </div>

            {notification.type === NotificationType.FRIEND_REQUEST_SENT && (
                <>
                    {accepted === 'accepted' ? (
                        <span className="text-xs text-gray-600">Đã chấp nhận lời mời kết bạn</span>
                    ) : accepted === 'cancel' ? (
                        <span className="text-xs text-gray-600">Đã gỡ lời mời kết bạn</span>
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <button
                                className="px-3 py-1 rounded-md bg-gray-200 text-gray-600"
                                onClick={() => handleCancelFriendRequest(notification.friendRequestId)}
                            >
                                Gỡ
                            </button>
                            <Button
                                type="primary"
                                onClick={() => handleAcceptFriendRequest(notification.friendRequestId)}
                            >
                                Chấp nhận
                            </Button>
                        </div>
                    )}
                </>
            )}
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
