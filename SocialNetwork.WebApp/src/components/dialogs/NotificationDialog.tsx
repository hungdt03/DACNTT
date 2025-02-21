import { FC, useState } from 'react'
import Notification from '../Notification'
import { NotificationResource } from '../../types/notification'
import { Button, Empty, Modal } from 'antd'
import { Pagination } from '../../types/response'
import useModal from '../../hooks/useModal'
import MentionPostModal from '../noti-mentions/comments/MentionPostModal'
import { NotificationType } from '../../enums/notification-type'
import MentionSharePostModal from '../noti-mentions/sharings/MentionSharePostModal'
import { useNavigate } from 'react-router-dom'
import notificationService from '../../services/notificationService'
import { toast } from 'react-toastify'
import NotificationSkeleton from '../skeletons/NotificationSkeleton'
import { ReportResource } from '../../types/report'
import adminService from '../../services/adminService'
import { ReportType } from '../../enums/report-type'
import { useElementInfinityScroll } from '../../hooks/useElementInfinityScroll'

type NotificationDialogProps = {
    notifications: NotificationResource[]
    pagination: Pagination
    loading: boolean
    isInitialLoadComplete: boolean
    onFinishInitialLoad: () => void
    onFetchNextPage: () => void
    onUpdateNotifications: (notifications: NotificationResource[]) => void
}

const NotificationDialog: FC<NotificationDialogProps> = ({
    notifications,
    pagination,
    loading,
    isInitialLoadComplete,
    onFinishInitialLoad,
    onFetchNextPage,
    onUpdateNotifications
}) => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal()
    const [notification, setNotification] = useState<NotificationResource>()

    const { isModalOpen: openReport, handleCancel: cancelReport, showModal: showReport } = useModal()
    const { isModalOpen: openReportDelete, handleCancel: cancelReportDelete, showModal: showReportDelete } = useModal()
    const [getReport, setGetReport] = useState<ReportResource>()
    const navigate = useNavigate()

    const getReportId = async (reportId: string) => {
        const response = await adminService.GetReportById(reportId)
        if (response.isSuccess) {
            setGetReport(response.data)
        }
    }

    useElementInfinityScroll({
        elementId: 'notification-dialog-element',
        hasMore: pagination.hasMore,
        isLoading: loading,
        onLoadMore: () => isInitialLoadComplete && onFetchNextPage()
    })

    const handleDeleteNotification = async (notificationId: string) => {
        const response = await notificationService.deleteNotification(notificationId)
        if (response.isSuccess) {
            const updateNotifications = [...notifications.filter((n) => n.id !== notificationId)]
            onUpdateNotifications(updateNotifications)
            toast.success(response.message)
        }
    }

    const handleMarkNotificationAsRead = async (notificationId: string) => {
        const response = await notificationService.markNotificationAsRead(notificationId)
        if (response.isSuccess) {
            const updateNotifications = notifications.map((notification) =>
                notification.id === notificationId ? { ...notification, isRead: true } : notification
            )

            onUpdateNotifications(updateNotifications)
        } else {
            // toast.error(response.message)
        }
    }

    const handleOpenMentionComment = (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        setNotification(notification)
        showModal()
    }

    const handleOpenMentionShare = (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        setNotification(notification)
        showModal()
    }

    const handleRedirectToStoryPage = (notification: NotificationResource) => {
        const notiId = notification.id
        const storyId = notification.storyId
        const userId = notification.recipient.id

        handleMarkNotificationAsRead(notification.id)
        navigate(`/stories/${userId}?noti_id=${notiId}&story_id=${storyId}`)
    }

    const handleRedirectToProfileSenderPage = async (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        navigate(`/profile/${notification.friendRequest.senderId}`)
    }

    const handleRedirectToProfileReceiverPage = async (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        navigate(`/profile/${notification.friendRequest.receiverId}`)
    }

    const handleRedirectToGroupPage = async (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        navigate(`/groups/${notification.groupId}`)
    }
    const handleReportReceiverPage = async (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        setNotification(notification)
        await getReportId(notification.reportId)
        showReport()
    }
    const handleReportDeleteReceiverPage = async (noti: NotificationResource) => {
        console.log(noti.reportId)
        console.log(noti.id)
        handleMarkNotificationAsRead(noti.id)
        setNotification(notification)
        await getReportId(noti.reportId)
        console.log(noti.reportId)
        console.log(getReport)
        showReportDelete()
    }

    return (
        <>
            <div
                id='notification-dialog-element'
                className='z-50 flex flex-col gap-y-3 pt-2 px-2 max-h-[600px] min-w-[400px] overflow-y-auto custom-scrollbar'
            >
                <span className='font-semibold text-lg'>Thông báo của bạn</span>
                <div className='flex flex-col gap-y-2'>
                    {notifications.map((notifi) => (
                        <Notification
                            onShareNotification={() => handleOpenMentionShare(notifi)}
                            onCommentNotification={() => handleOpenMentionComment(notifi)}
                            onStoryNotification={() => handleRedirectToStoryPage(notifi)}
                            onDelete={() => handleDeleteNotification(notifi.id)}
                            onMarkAsRead={() => handleMarkNotificationAsRead(notifi.id)}
                            key={notifi.id}
                            notification={notifi}
                            onRequestFriendNotification={() => handleRedirectToProfileSenderPage(notifi)}
                            onAcceptRequestFriendNotification={() => handleRedirectToProfileReceiverPage(notifi)}
                            onPostReactionNotification={() => handleOpenMentionComment(notifi)}
                            onGroupNotification={() => handleRedirectToGroupPage(notifi)}
                            onReportUserNotification={() => handleReportReceiverPage(notifi)}
                            onReportDeleteNotification={() => handleReportDeleteReceiverPage(notifi)}
                        />
                    ))}

                    {loading && <NotificationSkeleton />}
                    <div id='noti-scroll-trigger' className='w-full h-1' />
                    {notifications.length === 0 && !loading && <Empty description='Chưa có thông báo nào' />}

                    {!isInitialLoadComplete && !loading && pagination.hasMore && (
                        <button
                            className='w-full text-center text-sm py-1 bg-gray-200 rounded-md'
                            onClick={() => {
                                onFinishInitialLoad()
                            }}
                        >
                            Tải thêm ...
                        </button>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    style={{ top: 20 }}
                    title={<p className='text-center font-bold text-lg'>Bài viết được nhắc đến</p>}
                    width='700px'
                    footer={[]}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    classNames={{
                        footer: 'hidden'
                    }}
                    styles={{
                        body: {
                            padding: '0px',
                            paddingBottom: 20
                        },
                        content: {
                            position: 'relative'
                        },
                        footer: {
                            display: 'none'
                        }
                    }}
                >
                    {(notification?.type.includes('COMMENT') ||
                        notification?.type === NotificationType.ASSIGN_POST_TAG ||
                        (notification?.type === NotificationType.POST_REACTION && notification.postId)) && (
                        <MentionPostModal postId={notification.postId} commentId={notification.commentId} />
                    )}
                    {notification?.type === NotificationType.POST_SHARED && notification.postId && (
                        <MentionSharePostModal postId={notification.postId} />
                    )}
                </Modal>
            )}

            {openReport && (
                <Modal
                    title={<p className='text-center font-bold text-lg'>{notification?.title}</p>}
                    centered
                    open={openReport}
                    onCancel={cancelReport}
                    footer={[
                        <Button key='ok' type='primary' onClick={cancelReport}>
                            Xong
                        </Button>
                    ]}
                >
                    <div className='flex flex-col gap-y-2'>
                        <span className='text-[16px] font-bold'>
                            Xin chào, <span className='text-blue-600'>{notification?.recipient?.fullName}</span>
                        </span>

                        <p className='text-sm text-gray-600'>
                            <strong>Chúng tôi đã xem xét báo cáo của bạn và xin thông báo:</strong>
                        </p>

                        <p className='text-sm text-gray-600'>
                            {(() => {
                                switch (getReport?.reportType) {
                                    case ReportType.USER:
                                        return (
                                            <>
                                                Báo cáo của bạn về tài khoản
                                                <strong className='text-blue-600'>
                                                    {' '}
                                                    "{getReport?.targetUser?.fullName}"
                                                </strong>
                                                đã được <strong>xử lý</strong>.
                                            </>
                                        )
                                    case ReportType.POST:
                                        return (
                                            <>
                                                Báo cáo của bạn về bài viết của
                                                <strong className='text-blue-600'>
                                                    {' '}
                                                    "{getReport?.targetPost?.user?.fullName}"
                                                </strong>
                                                đã được <strong>xử lý</strong>.
                                            </>
                                        )
                                    case ReportType.GROUP:
                                        return (
                                            <>
                                                Báo cáo của bạn về nhóm
                                                <strong className='text-blue-600'>
                                                    {' '}
                                                    "{getReport?.targetGroup?.name}"
                                                </strong>
                                                đã được <strong>xử lý</strong>.
                                            </>
                                        )
                                    case ReportType.COMMENT:
                                        return (
                                            <>
                                                Báo cáo của bạn về bình luận của
                                                <strong className='text-blue-600'>
                                                    {' '}
                                                    "{getReport?.targetComment?.user?.fullName}"
                                                </strong>
                                                đã được <strong>xử lý</strong>.
                                            </>
                                        )
                                    default:
                                        return <strong>Báo cáo của bạn đã được xử lý.</strong>
                                }
                            })()}
                        </p>

                        <p className='text-sm text-gray-600'>
                            <strong>📌 Kết quả xử lý: </strong>
                            {getReport?.resolutionNotes ? (
                                <span className='text-green-600'>{getReport?.resolutionNotes}</span>
                            ) : (
                                'Chúng tôi đã thực hiện các biện pháp cần thiết theo chính sách cộng đồng.'
                            )}
                        </p>
                        <p className='text-sm text-gray-600'>
                            Cảm ơn bạn đã giúp chúng tôi xây dựng một <strong>cộng đồng an toàn và lành mạnh!</strong>{' '}
                            🚀
                        </p>
                    </div>
                </Modal>
            )}
            {openReportDelete && (
                <Modal
                    title={<p className='text-center font-bold text-lg'>📌 Thông báo Xóa Nội Dung Vi Phạm</p>}
                    centered
                    open={openReportDelete}
                    onCancel={cancelReportDelete}
                    footer={[
                        <Button key='ok' type='primary' onClick={cancelReportDelete}>
                            Xong
                        </Button>
                    ]}
                >
                    <div className='flex flex-col gap-y-3 text-gray-700'>
                        <span className='text-[16px] font-bold'>
                            Chào <span className='text-blue-600'>{notification?.recipient?.fullName}</span>,
                        </span>

                        <p className='text-sm'>
                            Chúng tôi xin thông báo rằng bài viết/bình luận của bạn đã bị xóa do vi phạm các tiêu chuẩn
                            cộng đồng của nền tảng.
                        </p>

                        <p className='text-sm'>
                            <strong>🛑 Nội dung bị xóa:</strong>
                            {getReport?.reportType === ReportType.POST && (
                                <span className='block text-red-600'>
                                    📌 Bài viết: "{getReport?.targetPost?.content?.slice(0, 100)}..."
                                </span>
                            )}
                            {getReport?.reportType === ReportType.COMMENT && (
                                <span className='block text-red-600'>
                                    📌 Bình luận: "{getReport?.targetComment?.content?.slice(0, 100)}..."
                                </span>
                            )}
                        </p>

                        <p className='text-sm'>
                            <strong>📜 Lý do vi phạm:</strong>
                        </p>
                        <ul className='text-sm list-disc list-inside'>
                            <li>🔹 Nội dung chứa thông tin sai lệch/gây hiểu lầm</li>
                            <li>🔹 Ngôn từ kích động, thù địch hoặc xúc phạm</li>
                            <li>🔹 Vi phạm quyền riêng tư hoặc quấy rối người khác</li>
                            <li>🔹 Nội dung không phù hợp với cộng đồng</li>
                        </ul>

                        <p className='text-sm'>
                            Chúng tôi khuyến khích bạn đọc lại <strong>Chính sách Cộng đồng</strong> để tránh vi phạm
                            trong tương lai. Nếu bạn cho rằng đây là một sự nhầm lẫn, bạn có thể gửi yêu cầu xem xét
                            lại.
                        </p>

                        <p className='text-sm'>
                            Cảm ơn bạn đã đồng hành cùng chúng tôi trong việc xây dựng một{' '}
                            <strong>cộng đồng lành mạnh!</strong> 🚀
                        </p>

                        <p className='text-sm font-semibold'>Trân trọng,</p>
                        <p className='text-sm font-semibold'>🚀 [SocialNetwork] – Đội ngũ Hỗ trợ</p>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default NotificationDialog
