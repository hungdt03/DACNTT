import React, { useState } from 'react'
import { Modal, Button, Form, Input, Typography } from 'antd'
import { toast } from 'react-toastify'
import adminService from '../../services/adminService'
import { ReportResource } from '../../types/report'
import { ReportType } from '../../enums/report-type'

const statusOptions = [
    { status: 'PENDING', label: 'Chưa xử lý' },
    { status: 'RESOLVED', label: 'Đã xử lý' },
    { status: 'REJECTED', label: 'Đã từ chối' }
]
const reportTypeOptions = [
    { type: ReportType.USER, label: 'Tài khoản' },
    { type: ReportType.GROUP, label: 'Nhóm' },
    { type: ReportType.POST, label: 'Bài viết' },
    { type: ReportType.COMMENT, label: 'Bình luận' }
]

type UpdateReportDialogProps = {
    isVisible: boolean
    onClose: () => void
    fetchReports: () => void
    tagetReport: ReportResource
}

const UpdateReportDialog: React.FC<UpdateReportDialogProps> = ({ tagetReport, isVisible, onClose, fetchReports }) => {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(tagetReport.status)

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true)
        const response = await adminService.UpdateStatusReport(tagetReport.id, newStatus)
        setLoading(false)
        if (response.isSuccess) {
            fetchReports()
            toast.success('Cập nhật trạng thái thành công')
        } else {
            toast.error(response.message)
        }
    }

    return (
        <Modal
            title={
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        paddingBottom: '20px'
                    }}
                >
                    Cập nhật báo cáo
                </div>
            }
            open={isVisible}
            onCancel={onClose}
            footer={null}
            centered
            style={{ paddingTop: '100px' }}
        >
            <Form layout='horizontal'>
                <Form.Item label={<span style={{ fontWeight: 'bold' }}>Lý do báo cáo</span>}>
                    <Typography.Paragraph
                        style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-line' }}
                    >
                        {tagetReport.reason}
                    </Typography.Paragraph>
                </Form.Item>

                <Form.Item label={<span style={{ fontWeight: 'bold' }}>Loại báo cáo</span>}>
                    {reportTypeOptions.map((option) => (
                        <Button
                            key={option.type}
                            type={tagetReport.reportType === option.type ? 'primary' : 'default'}
                            style={{ marginRight: 8, cursor: 'not-allowed' }}
                        >
                            {option.label}
                        </Button>
                    ))}
                </Form.Item>

                <Form.Item label={<span style={{ fontWeight: 'bold' }}>Ghi chú giải quyết</span>}>
                    <Input.TextArea value={tagetReport.resolutionNotes} disabled />
                </Form.Item>

                <Form.Item label={<span style={{ fontWeight: 'bold' }}>Trạng thái</span>}>
                    {statusOptions.map((option) => (
                        <Button
                            key={option.status}
                            type={status === option.status ? 'primary' : 'default'}
                            onClick={() => setStatus(option.status)}
                            style={{ marginRight: 8 }}
                        >
                            {option.label}
                        </Button>
                    ))}
                </Form.Item>

                <Form.Item label={<span style={{ fontWeight: 'bold' }}>Người báo cáo</span>}>
                    <Typography.Text>{tagetReport.reporter?.fullName}</Typography.Text>
                </Form.Item>

                {tagetReport.reportType === ReportType.USER && (
                    <Form.Item label={<span style={{ fontWeight: 'bold' }}>Người bị báo cáo</span>}>
                        <Typography.Text>{tagetReport.targetUser.fullName}</Typography.Text>
                    </Form.Item>
                )}

                {tagetReport.reportType === ReportType.POST && (
                    <Form.Item label={<span style={{ fontWeight: 'bold' }}>Bài viết liên quan</span>}>
                        <Typography.Text>{tagetReport.targetPost.content}</Typography.Text>
                    </Form.Item>
                )}

                {tagetReport.reportType === ReportType.COMMENT && (
                    <Form.Item label={<span style={{ fontWeight: 'bold' }}>Bình luận liên quan</span>}>
                        <Typography.Text>{tagetReport.targetComment.content}</Typography.Text>
                    </Form.Item>
                )}

                {tagetReport.reportType === ReportType.GROUP && (
                    <Form.Item label={<span style={{ fontWeight: 'bold' }}>Nhóm liên quan</span>}>
                        <Typography.Text>{tagetReport.targetGroup.name}</Typography.Text>
                    </Form.Item>
                )}

                <Form.Item label={<span style={{ fontWeight: 'bold' }}>Ngày tạo</span>}>
                    <Typography.Text>{new Date(tagetReport.dateCreatedAt).toLocaleString()}</Typography.Text>
                </Form.Item>

                {tagetReport.resolvedAt && (
                    <Form.Item label={<span style={{ fontWeight: 'bold' }}>Ngày giải quyết</span>}>
                        <Typography.Text>{new Date(tagetReport.resolvedAt).toLocaleString()}</Typography.Text>
                    </Form.Item>
                )}
                <Form.Item>
                    <Button type='primary' onClick={() => handleStatusChange(status)} loading={loading} block>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateReportDialog
