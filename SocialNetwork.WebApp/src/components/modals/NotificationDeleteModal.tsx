import { Button, Modal } from 'antd'
import { FC } from 'react'
import { ReportType } from '../../enums/report-type'
import { NotificationResource } from '../../types/notification'
import { ReportResource } from '../../types/report'
import { PostResource } from '../../types/post'
import { GroupResource } from '../../types/group'
import { CommentResource } from '../../types/comment'

type NotificationDeleteModalProps = {
    notification: NotificationResource | undefined
    openDeleteModal: boolean
    cancelDeleteModal: () => void
    getReport: ReportResource | undefined
    getPost: PostResource | undefined
    getGroup: GroupResource | undefined
    getComment: CommentResource | undefined
}

const NotificationDeleteModal: FC<NotificationDeleteModalProps> = ({
    cancelDeleteModal,
    openDeleteModal,
    notification,
    getReport,
    getPost,
    getGroup,
    getComment
}) => {
    return (
        <Modal
            title={<p className='text-center font-bold text-lg'>📌 Thông báo Xóa Nội Dung Vi Phạm</p>}
            centered
            open={openDeleteModal}
            onCancel={cancelDeleteModal}
            footer={[
                <Button key='ok' type='primary' onClick={cancelDeleteModal}>
                    Xong
                </Button>
            ]}
        >
            <div className='flex flex-col gap-y-3 text-gray-700'>
                <span className='text-[16px] font-bold'>
                    Xin chào <span className='text-blue-600'>{notification?.recipient?.fullName}</span>,
                </span>

                <p className='text-sm'>
                    Chúng tôi xin thông báo rằng{getReport?.reportType === ReportType.POST ? ' Bài viết ' : ''}
                    {getReport?.reportType === ReportType.GROUP ? ' Nhóm ' : ''}
                    {getReport?.reportType === ReportType.COMMENT ? ' Bình luận ' : ''}của bạn đã bị xóa do vi phạm các
                    tiêu chuẩn cộng đồng của nền tảng.
                </p>

                <p className='text-sm'>
                    <strong>🛑 Nội dung bị xóa:</strong>
                    {getPost && (
                        <span className='block text-red-600'>📌 Bài viết: "{getPost?.content?.slice(0, 100)}..."</span>
                    )}
                    {getComment && (
                        <span className='block text-red-600'>
                            📌 Bình luận: "{getComment?.content?.slice(0, 100)}..."
                        </span>
                    )}
                    {getGroup && (
                        <>
                            <span className='block text-red-600'>
                                📌 Tên nhóm: "{getGroup?.name?.slice(0, 100)}..."
                            </span>
                            <span className='block text-red-600'>
                                📌 Mô tả: "{getGroup?.description?.slice(0, 100)}..."
                            </span>
                        </>
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
                    Chúng tôi khuyến khích bạn đọc lại <strong>Chính sách Cộng đồng</strong> để tránh vi phạm trong
                    tương lai. Nếu bạn cho rằng đây là một sự nhầm lẫn, bạn có thể gửi yêu cầu xem xét lại.
                </p>

                <p className='text-sm'>
                    Cảm ơn bạn đã đồng hành cùng chúng tôi trong việc xây dựng một <strong>cộng đồng lành mạnh!</strong>{' '}
                    🚀
                </p>

                <p className='text-sm font-semibold'>Trân trọng,</p>
                <p className='text-sm font-semibold'>🚀 [SocialNetwork] – Đội ngũ Hỗ trợ</p>
            </div>
        </Modal>
    )
}

export default NotificationDeleteModal
