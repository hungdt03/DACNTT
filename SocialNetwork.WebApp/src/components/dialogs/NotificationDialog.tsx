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
import { useElementInfinityScroll } from '../../hooks/useElementInfinityScroll'
import reportService from '../../services/reportService'
import { ReportType } from '../../enums/report-type'

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
    const [getReport, setGetReport] = useState<ReportResource>()
    const navigate = useNavigate()

    const getReportById = async (reportId: string) => {
        const response = await reportService.getReportById(reportId)
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
        await getReportById(notification.reportId)
        showReport()
    }

    const handleRedirectToAdminReportPage = async (notification: NotificationResource) => {
        handleMarkNotificationAsRead(notification.id)
        navigate(`/admin/reports`)
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
                            onReportResponseNotification={() => handleReportReceiverPage(notifi)}
                            onReportAdminNotification={() => handleRedirectToAdminReportPage(notifi)}
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
                    {(
                        notification?.type === NotificationType.COMMENTED_ON_POST ||
                        notification?.type === NotificationType.REPLIED_TO_COMMENT ||
                        notification?.type === NotificationType.ASSIGN_POST_TAG ||
                        (notification?.type === NotificationType.POST_REACTION && notification.postId))
                        && (
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

                        {notification?.type === NotificationType.REPORT_RESPONSE_REPORTEE && <ReporteeResponse content={notification?.content ?? 'Nội dung của bạn đã vi phạm các quy tắc, chính sách của chúng tôi'} />}
                        {notification?.type === NotificationType.REPORT_RESPONSE_REPORTER && getReport && <ReporterResponse content={notification.content} />}
                    </div>
                </Modal>
            )}
        </>
    )
}

export default NotificationDialog;

type ReporteeResponseProps = {
    content: string
}

const ReporteeResponse:FC<ReporteeResponseProps> = ({
    content
}) => {
    return <div>
        <p className='text-sm text-gray-600'>
            <strong>Chúng tôi đã nhận được báo cáo về nội dung của bạn trên LinkUp</strong>
        </p>
        <p>{content}</p>
        Chúng tôi mong muốn tạo ra một không gian tích cực và an toàn cho tất cả mọi người. Vui lòng đảm bảo tuân thủ các quy tắc trong tương lai. Nếu bạn cần hỗ trợ, hãy liên hệ với chúng tôi.
        🚀
    </div>
}

type ReporterResponseProps = {
    content: string;
}

const ReporterResponse: FC<ReporterResponseProps> = ({
    content
}) => {
    return <>
        <p className='text-sm text-gray-600'>
            <strong>📌 KẾT QUẢ XỬ LÍ BÁO CÁO:</strong>
        </p>

        <p className='text-sm text-gray-600'>
           {content}
        </p>
       
        <p className='text-sm text-gray-600'>
            Cảm ơn bạn đã giúp chúng tôi xây dựng một <strong>cộng đồng an toàn và lành mạnh!</strong>{' '}
            🚀
        </p>
    </>
}
