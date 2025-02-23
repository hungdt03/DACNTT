import { Button, message, Popover } from 'antd'
import { FC, useState } from 'react'
import images from '../assets'
import { Check, Delete, MoreHorizontal } from 'lucide-react'
import { NotificationResource } from '../types/notification'
import { formatTime } from '../utils/date'
import cn from '../utils/cn'
import { NotificationType } from '../enums/notification-type'
import friendRequestService from '../services/friendRequestService'
import { toast } from 'react-toastify'
import notificationService from '../services/notificationService'
import groupService from '../services/groupService'
import notis from '../assets/noti'

type NotificationMoreActionProps = {
    onMarkAsRead?: () => void
    onDelete?: () => void
    isRead: boolean
}

const NotificationMoreAction: FC<NotificationMoreActionProps> = ({ onMarkAsRead, onDelete, isRead }) => {
    return (
        <div onClick={(e) => e.stopPropagation()} className='flex flex-col items-start rounded-md'>
            {!isRead && (
                <button
                    onClick={onMarkAsRead}
                    className='w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer'
                >
                    <Check size={17} className='text-gray-500' />
                    Đánh dấu là đã đọc
                </button>
            )}
            <button
                onClick={onDelete}
                className='w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer'
            >
                <Delete size={17} className='text-gray-500' />
                Xóa thông báo
            </button>
        </div>
    )
}

type NotificationProps = {
    notification: NotificationResource
    onDelete?: () => void
    onMarkAsRead?: () => void
    onCommentNotification: () => void
    onShareNotification: () => void
    onStoryNotification: () => void
    onRequestFriendNotification: () => void
    onAcceptRequestFriendNotification: () => void
    onPostReactionNotification: () => void
    onGroupNotification: () => void
    onReportResponseNotification: () => void
    onReportAdminNotification: () => void
}

const Notification: FC<NotificationProps> = ({
    notification,
    onDelete,
    onMarkAsRead,
    onCommentNotification,
    onShareNotification,
    onStoryNotification,
    onRequestFriendNotification,
    onAcceptRequestFriendNotification,
    onPostReactionNotification,
    onGroupNotification,
    onReportResponseNotification,
    onReportAdminNotification,

}) => {
    const [showMoreAction, setShowMoreAction] = useState(false)
    const [acceptedFriendRequest, setAcceptedFriendRequest] = useState<'accepted' | 'cancel' | 'none'>('none')
    const [acceptedJoinGroup, setAcceptedJoinGroup] = useState<'accepted' | 'cancel' | 'none'>('none')
    const [acceptedRole, setAcceptedRole] = useState<'accepted' | 'cancel' | 'none'>('none')
    const [acceptRequestJoinGroup, setAcceptRequestJoinGroup] = useState<'accepted' | 'reject' | 'none'>('none')

    // FRIEND REQUEST
    const handleCancelFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.cancelFriendRequest(requestId)
        if (response.isSuccess) {
            setAcceptedFriendRequest('cancel')
            toast.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            toast.error(response.message)
            handleDeleteNotification(notification.id)
        }
    }

    const handleAcceptFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.acceptFriendRequest(requestId)
        if (response.isSuccess) {
            setAcceptedFriendRequest('accepted')
            message.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            message.error(response.message)
            handleDeleteNotification(notification.id)
        }
    }

    // REQUEST JOIN GROUP

    const handleRejectRequestJoinGroup = async (requestId: string) => {
        const response = await groupService.rejectRequestJoinGroup(requestId)
        if (response.isSuccess) {
            setAcceptRequestJoinGroup('reject')
            message.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            message.error(response.message)
            handleDeleteNotification(notification.id)
        }
    }

    const handleAcceptRequestJoinGroup = async (requestId: string) => {
        const response = await groupService.approvalRequestJoinGroup(requestId)
        if (response.isSuccess) {
            setAcceptRequestJoinGroup('accepted')
            message.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            message.error(response.message)
            handleDeleteNotification(notification.id)
        }
    }

    // INVITE JOIN GROUP

    const handleRejectJoinGroup = async (inviteId: string) => {
        const response = await groupService.rejectInviteFriend(inviteId)
        if (response.isSuccess) {
            setAcceptedJoinGroup('cancel')
            message.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            message.error(response.message)
            handleDeleteNotification(notification.id)
        }
    }

    const handleAcceptJoinGroup = async (inviteId: string) => {
        const response = await groupService.acceptInviteFriend(inviteId)
        if (response.isSuccess) {
            setAcceptedJoinGroup('accepted')
            message.success(response.message)
            handleDeleteNotification(notification.id)
        } else {
            message.error(response.message)
            handleDeleteNotification(notification.id)
        }
    }

    // INVITE ROLE GROUP

    const handleAcceptRoleInvitation = async (invitationId: string) => {
        const response = await groupService.acceptRoleInvitation(invitationId)
        if (response.isSuccess) {
            message.success(response.message)
            setAcceptedRole('accepted')
        } else {
            message.error(response.message)
        }

        handleDeleteNotification(notification.id)
    }

    const handleRejectRoleInvitation = async (invitationId: string) => {
        const response = await groupService.rejectRoleInvitation(invitationId)
        if (response.isSuccess) {
            message.success(response.message)
            setAcceptedRole('cancel')
        } else {
            message.error(response.message)
        }

        handleDeleteNotification(notification.id)
    }

    const handleDeleteNotification = async (notificationId: string) => {
        await notificationService.deleteNotification(notificationId)
    }

    const handleSelectNotification = () => {
        if (
            notification.type === NotificationType.COMMENTED_ON_POST ||
            notification.type === NotificationType.REPLIED_TO_COMMENT
        ) {
            onCommentNotification()
        } else if (notification.type === NotificationType.POST_SHARED) {
            onShareNotification()
        } else if (notification.type.includes('STORY')) {
            onStoryNotification()
        } else if (notification.type === NotificationType.FRIEND_REQUEST_SENT) {
            onRequestFriendNotification()
        } else if (notification.type === NotificationType.FRIEND_REQUEST_ACCEPTED) {
            onAcceptRequestFriendNotification()
        } else if (
            notification.type === NotificationType.ASSIGN_POST_TAG ||
            notification.type === NotificationType.POST_REACTION
        ) {
            onPostReactionNotification()
        } else if (
            notification.type === NotificationType.INVITE_JOIN_GROUP ||
            notification.type === NotificationType.APPROVAL_GROUP_INVITATION ||
            notification.type === NotificationType.APPROVAL_JOIN_GROUP_REQUEST ||
            notification.type === NotificationType.INVITE_ROLE_GROUP
        ) {
            onGroupNotification()
        } else if (
            notification.type === NotificationType.REPORT_RESPONSE_REPORTEE
            || notification.type === NotificationType.REPORT_RESPONSE_REPORTER
        ) {
            onReportResponseNotification()
        } else if (
            notification.type === NotificationType.REPORT_POST ||
            notification.type === NotificationType.REPORT_COMMENT ||
            notification.type === NotificationType.REPORT_USER ||
            notification.type === NotificationType.REPORT_GROUP
        ) {
            onReportAdminNotification()
        }
    }

    return (
        <div
            onClick={handleSelectNotification}
            onMouseOver={() => setShowMoreAction(true)}
            onMouseLeave={() => setShowMoreAction(false)}
            className={cn(
                'relative cursor-pointer flex items-center gap-x-3 px-3 py-2 rounded-md hover:bg-gray-100 max-w-[400px]'
            )}
        >
            <div className='flex-shrink-0 relative'>
                <img
                    className='w-[55px] h-[55px] rounded-full object-cover'
                    src={notification.imageUrl ?? images.user}
                />
                <img
                    className='absolute -right-[6px] -bottom-[4px] w-6 h-6'
                    src={
                        notification.type.includes('COMMENT')
                            ? notis.commentNoti
                            : notification.type === NotificationType.FRIEND_REQUEST_ACCEPTED ||
                                notification.type === NotificationType.FRIEND_REQUEST_SENT
                                ? notis.userNoti
                                : notification.type === NotificationType.JOIN_GROUP_REQUEST ||
                                    notification.type === NotificationType.APPROVAL_GROUP_INVITATION ||
                                    notification.type === NotificationType.APPROVAL_JOIN_GROUP_REQUEST ||
                                    notification.type === NotificationType.INVITE_JOIN_GROUP
                                    ? images.group
                                    : notification.type === NotificationType.POST_SHARED
                                        ? notis.notiShare
                                        : notification.type === NotificationType.VIEW_STORY
                                            ? notis.viewStory
                                            : notification.type === NotificationType.REACT_STORY ||
                                                notification.type === NotificationType.POST_REACTION
                                                ? notis.notiReaction
                                                : notification.type === NotificationType.ASSIGN_POST_TAG
                                                    ? notis.notiTag
                                                    :
                                                    (notification.type === NotificationType.REPORT_RESPONSE_REPORTEE
                                                        || notification.type === NotificationType.REPORT_RESPONSE_REPORTER)
                                                        ? notis.notiReport
                                                        : notification.type === NotificationType.APPROVAL_POST
                                                            ? notis.notiApproval
                                                            : notis.notiBell
                    }
                />
            </div>
            <div className='flex flex-col gap-y-3 items-start'>
                <div className='flex flex-col items-start'>
                    <div className='flex-1 line-clamp-2'>{notification.content}</div>
                    <span className={cn('text-gray-500 text-xs font-semibold', !notification.isRead && 'text-primary')}>
                        {formatTime(new Date(notification.dateSent))}
                    </span>
                </div>

                {notification.type === NotificationType.INVITE_JOIN_GROUP && (
                    <>
                        {acceptedJoinGroup === 'accepted' ? (
                            <span className='text-xs text-gray-600'>Đã chấp nhận tham gia nhóm</span>
                        ) : acceptedJoinGroup === 'cancel' ? (
                            <span className='text-xs text-gray-600'>Đã gỡ lời mời tham gia nhóm</span>
                        ) : (
                            <div className='flex items-center gap-x-2'>
                                <button
                                    className='px-3 py-[1px] rounded-md bg-gray-200 text-gray-600'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRejectJoinGroup(notification.groupInvitationId)
                                    }}
                                >
                                    Gỡ
                                </button>
                                <Button
                                    size='small'
                                    type='primary'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAcceptJoinGroup(notification.groupInvitationId)
                                    }}
                                >
                                    Chấp nhận
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {notification.type === NotificationType.JOIN_GROUP_REQUEST && (
                    <>
                        {acceptRequestJoinGroup === 'accepted' ? (
                            <span className='text-xs text-gray-600'>Đã phê duyệt yêu cầu</span>
                        ) : acceptRequestJoinGroup === 'reject' ? (
                            <span className='text-xs text-gray-600'>Đã gỡ lời yêu cầu tham gia nhóm</span>
                        ) : (
                            <div className='flex items-center gap-x-2'>
                                <button
                                    className='px-3 py-[1px] rounded-md bg-gray-200 text-gray-600'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRejectRequestJoinGroup(notification.joinGroupRequestId)
                                    }}
                                >
                                    Gỡ
                                </button>
                                <Button
                                    size='small'
                                    type='primary'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAcceptRequestJoinGroup(notification.joinGroupRequestId)
                                    }}
                                >
                                    Phê duyệt
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {notification.type === NotificationType.FRIEND_REQUEST_SENT && (
                    <>
                        {acceptedFriendRequest === 'accepted' ? (
                            <span className='text-xs text-gray-600'>Đã chấp nhận lời mời kết bạn</span>
                        ) : acceptedFriendRequest === 'cancel' ? (
                            <span className='text-xs text-gray-600'>Đã gỡ lời mời kết bạn</span>
                        ) : (
                            <div className='flex items-center gap-x-2'>
                                <button
                                    className='px-3 py-[1px] rounded-md bg-gray-200 text-gray-600'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleCancelFriendRequest(notification.friendRequestId)
                                    }}
                                >
                                    Gỡ
                                </button>
                                <Button
                                    size='small'
                                    type='primary'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAcceptFriendRequest(notification.friendRequestId)
                                    }}
                                >
                                    Chấp nhận
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {notification.type === NotificationType.INVITE_ROLE_GROUP && (
                    <>
                        {acceptedRole === 'accepted' ? (
                            <span className='text-xs text-gray-600'>Đã chấp nhận lời mời</span>
                        ) : acceptedRole === 'cancel' ? (
                            <span className='text-xs text-gray-600'>Đã gỡ lời mời</span>
                        ) : (
                            <div className='flex items-center gap-x-2'>
                                <button
                                    className='px-3 py-[1px] rounded-md bg-gray-200 text-gray-600'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRejectRoleInvitation(notification.groupRoleInvitationId)
                                    }}
                                >
                                    Gỡ
                                </button>
                                <Button
                                    size='small'
                                    type='primary'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAcceptRoleInvitation(notification.groupRoleInvitationId)
                                    }}
                                >
                                    Chấp nhận
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {!notification.isRead && (
                <div className='absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 rounded-full bg-primary'></div>
            )}

            {showMoreAction && (
                <Popover
                    trigger='click'
                    className='z-20'
                    content={
                        <NotificationMoreAction
                            isRead={notification.isRead}
                            onDelete={onDelete}
                            onMarkAsRead={onMarkAsRead}
                        />
                    }
                >
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className='absolute top-1/2 -translate-y-1/2 right-6 bg-white shadow transition-all ease-linear duration-100 border-[1px] border-gray-200 w-6 h-6 flex items-center justify-center rounded-full'
                    >
                        <MoreHorizontal className='text-gray-400' size={16} />
                    </button>
                </Popover>
            )}
        </div>
    )
}

export default Notification
