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
import groupService from "../services/groupService";


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
    onCommentNotification: () => void;
    onShareNotification: () => void;
    onStoryReactionNotification: () => void;
}

const Notification: FC<NotificationProps> = ({
    notification,
    onDelete,
    onMarkAsRead,
    onCommentNotification,
    onShareNotification,
    onStoryReactionNotification
}) => {
    const [showMoreAction, setShowMoreAction] = useState(false);
    const [acceptedFriendRequest, setAcceptedFriendRequest] = useState<'accepted' | 'cancel' | 'none'>('none');
    const [acceptedJoinGroup, setAcceptedJoinGroup] = useState<'accepted' | 'cancel' | 'none'>('none');

    const handleCancelFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.cancelFriendRequest(requestId)
        if (response.isSuccess) {
            setAcceptedFriendRequest('cancel')
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
            setAcceptedFriendRequest('accepted')
            toast.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            toast.error(response.message)
            onDelete?.()
        }
    };

    const handleRejectJoinGroup = async (inviteId: string) => {
        const response = await groupService.rejectInviteFriend(inviteId)
        if (response.isSuccess) {
            setAcceptedJoinGroup('cancel')
            toast.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            toast.error(response.message);
            onDelete?.()
        }
    };

    const handleAcceptJoinGroup = async (inviteId: string) => {
        console.log(notification)
        const response = await groupService.acceptInviteFriend(inviteId)
        if (response.isSuccess) {
            setAcceptedJoinGroup('accepted')
            toast.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            toast.error(response.message)
            onDelete?.()
        }
    };

    const handleDeleteNotification = async (notificationId: string) => {
        await notificationService.deleteNotification(notificationId);
    }

    const handleSelectNotification = () => {
        if (notification.type.includes('COMMENT')) {
            onCommentNotification()
        } else if (notification.type === NotificationType.POST_SHARED) {
            onShareNotification()
        } else if (notification.type === NotificationType.REACT_STORY) {
            onStoryReactionNotification()
        }
    }

    return <div onClick={handleSelectNotification} onMouseOver={() => setShowMoreAction(true)} onMouseLeave={() => setShowMoreAction(false)} className={cn("relative z-[100] cursor-pointer flex items-center gap-x-3 px-3 py-2 rounded-md hover:bg-gray-100 max-w-[400px]")}>
        <Avatar className="flex-shrink-0" size='large' src={notification.imageUrl ?? images.user} />
        <div className="flex flex-col gap-y-3 items-start">
            <div className="flex flex-col items-start">
                <div className="flex-1 line-clamp-2">
                    {notification.content}
                </div>
                <span className={cn("text-gray-500 text-xs font-semibold", !notification.isRead && 'text-primary')}>{formatTime(new Date(notification.dateSent))}</span>
            </div>

            {notification.type === NotificationType.INVITE_JOIN_GROUP && (
                <>
                    {acceptedJoinGroup === 'accepted' ? (
                        <span className="text-xs text-gray-600">Đã chấp nhận tham gia nhóm</span>
                    ) : acceptedJoinGroup === 'cancel' ? (
                        <span className="text-xs text-gray-600">Đã gỡ lời mời tham gia nhóm</span>
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <button
                                className="px-3 py-1 rounded-md bg-gray-200 text-gray-600"
                                onClick={() => handleRejectJoinGroup(notification.groupInvitationId)}
                            >
                                Gỡ
                            </button>
                            <Button
                                type="primary"
                                onClick={() => handleAcceptJoinGroup(notification.groupInvitationId)}
                            >
                                Chấp nhận
                            </Button>
                        </div>
                    )}
                </>
            )}

            {notification.type === NotificationType.FRIEND_REQUEST_SENT && (
                <>
                    {acceptedFriendRequest === 'accepted' ? (
                        <span className="text-xs text-gray-600">Đã chấp nhận lời mời kết bạn</span>
                    ) : acceptedFriendRequest === 'cancel' ? (
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

        {!notification.isRead && <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 rounded-full bg-primary">
        </div>}

        {showMoreAction && <Popover trigger='click' content={<NotificationMoreAction
            isRead={notification.isRead}
            onDelete={onDelete}
            onMarkAsRead={onMarkAsRead}
        />}>
            <button className="absolute top-1/2 -translate-y-1/2 right-6 !z-[2000] bg-white shadow transition-all ease-linear duration-100 border-[1px] border-gray-200 w-6 h-6 flex items-center justify-center rounded-full">
                <MoreHorizontal className="text-gray-400" size={16} />
            </button>
        </Popover>}
    </div>
};

export default Notification;
