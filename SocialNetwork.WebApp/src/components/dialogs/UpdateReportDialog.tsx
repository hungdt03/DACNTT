// import React, { useEffect, useState } from 'react'
// import { Modal, Button, Form, Input, Typography } from 'antd'
// import { toast } from 'react-toastify'
// import adminService from '../../services/adminService'
// import { ReportResource } from '../../types/report'
// import { ReportType } from '../../enums/report-type'

// const statusOptions = [
//     { status: 'PENDING', label: 'Chưa xử lý' },
//     { status: 'RESOLVED', label: 'Đã xử lý' },
//     { status: 'REJECTED', label: 'Đã từ chối' }
// ]
// const reportTypeOptions = [
//     { type: ReportType.USER, label: 'Tài khoản' },
//     { type: ReportType.GROUP, label: 'Nhóm' },
//     { type: ReportType.POST, label: 'Bài viết' },
//     { type: ReportType.COMMENT, label: 'Bình luận' }
// ]

// type UpdateReportDialogProps = {
//     isVisible: boolean
//     onClose: () => void
//     fetchReports: () => void
//     tagetReport: ReportResource
// }
// export type UpdateReport = {
//     id: string
//     newStatus: string
// }

// const UpdateReportDialog: React.FC<UpdateReportDialogProps> = ({ tagetReport, isVisible, onClose, fetchReports }) => {
//     const [loading, setLoading] = useState(false)
//     const [status, setStatus] = useState('')
//     const [btnCheckDelete, setBtnCheckDelete] = useState(false)
//     const [reportSoluton, setReportSoluton] = useState('')

//     useEffect(() => {
//         if (tagetReport) {
//             setStatus(tagetReport?.status)
//             setReportSoluton(tagetReport?.resolutionNotes)
//         }
//     }, [tagetReport])

//     const handleStatusChange = async () => {
//         const updatedPayload: UpdateReport = {
//             id: tagetReport.id,
//             newStatus: status,
//             newReportSolution: reportSoluton,
//             isDelete: btnCheckDelete
//         }

//         if (btnCheckDelete && tagetReport.reportType === ReportType.POST) {
//             setLoading(true)
//             const response = await adminService.UpdateReport(updatedPayload)
//             const rp = await adminService.DeleteOnePost(tagetReport?.targetPost?.id)
//             setLoading(false)
//             if (response.isSuccess && rp.isSuccess) {
//                 fetchReports()
//                 toast.success('Cập nhật trạng thái và gỡ bài viết thành công')
//             } else {
//                 toast.error(response.message)
//             }
//         } else if (btnCheckDelete && tagetReport.reportType === ReportType.COMMENT) {
//             setLoading(true)
//             const response = await adminService.UpdateReport(updatedPayload)
//             const rp = await adminService.DeleteOneComment(tagetReport?.targetComment?.id)
//             setLoading(false)
//             if (response.isSuccess && rp.isSuccess) {
//                 fetchReports()
//                 toast.success('Cập nhật trạng thái và gỡ bình luận thành công')
//             } else {
//                 toast.error(response.message)
//             }
//         } else if (btnCheckDelete && tagetReport.reportType === ReportType.GROUP) {
//             setLoading(true)
//             const response = await adminService.UpdateReport(updatedPayload)
//             const rp = await adminService.DeleteOneGroup(tagetReport?.targetGroup?.id)
//             setLoading(false)
//             if (response.isSuccess && rp.isSuccess) {
//                 fetchReports()
//                 toast.success('Cập nhật trạng thái và giải tán nhóm thành công')
//             } else {
//                 toast.error(response.message)
//             }
//         } else {
//             setLoading(true)
//             const response = await adminService.UpdateReport(updatedPayload)
//             setLoading(false)
//             if (response.isSuccess) {
//                 fetchReports()
//                 toast.success('Cập nhật trạng thái thành công')
//             } else {
//                 toast.error(response.message)
//             }
//         }
//     }

//     return (
//         <Modal
//             title={
//                 <div
//                     style={{
//                         textAlign: 'center',
//                         fontSize: '20px',
//                         fontWeight: 'bold',
//                         paddingBottom: '5px'
//                     }}
//                 >
//                     CẬP NHẬT BÁO CÁO
//                 </div>
//             }
//             open={isVisible}
//             onCancel={onClose}
//             footer={null}
//             centered
//             style={{ paddingTop: '80px' }}
//         >
//             <Form layout='horizontal'>
//                 <Form.Item
//                     label={<span style={{ fontWeight: 'bold' }}>Lý do báo cáo</span>}
//                     style={{ marginBottom: '10px' }}
//                 >
//                     <Typography.Paragraph
//                         style={{
//                             background: '#f5f5f5',
//                             padding: '8px',
//                             borderRadius: '5px',
//                             whiteSpace: 'pre-line',
//                             marginBottom: '4px'
//                         }}
//                     >
//                         {tagetReport?.reason}
//                     </Typography.Paragraph>
//                 </Form.Item>

//                 <Form.Item
//                     label={<span style={{ fontWeight: 'bold' }}>Loại báo cáo</span>}
//                     style={{ marginBottom: '10px' }}
//                 >
//                     {reportTypeOptions.map((option) => (
//                         <Button
//                             key={option.type}
//                             type={tagetReport?.reportType === option.type ? 'primary' : 'default'}
//                             style={{ marginRight: 4, cursor: 'not-allowed' }}
//                         >
//                             {option.label}
//                         </Button>
//                     ))}
//                 </Form.Item>

//                 <Form.Item label={<span style={{ fontWeight: 'bold' }}>Ghi chú</span>} style={{ marginBottom: '10px' }}>
//                     <Input.TextArea
//                         value={reportSoluton}
//                         onChange={(e) => setReportSoluton(e.target.value)}
//                         rows={2}
//                         className='w-full'
//                         disabled={tagetReport.status === 'RESOLVED' || tagetReport.status === 'REJECTED'}
//                     />
//                 </Form.Item>
//                 {tagetReport.status === 'RESOLVED' && (
//                     <Form.Item
//                         label={<span style={{ fontWeight: 'bold' }}>Trạng thái</span>}
//                         style={{ marginBottom: '10px' }}
//                     >
//                         {statusOptions.map((option) => (
//                             <Button
//                                 key={option.status}
//                                 type={status === option.status ? 'primary' : 'default'}
//                                 onClick={() => setStatus(option.status)}
//                                 style={{ marginRight: 4 }}
//                                 disabled={option.status === 'PENDING' || option.status === 'REJECTED'}
//                             >
//                                 {option.label}
//                             </Button>
//                         ))}
//                     </Form.Item>
//                 )}
//                 {tagetReport.status === 'REJECTED' && (
//                     <Form.Item
//                         label={<span style={{ fontWeight: 'bold' }}>Trạng thái</span>}
//                         style={{ marginBottom: '10px' }}
//                     >
//                         {statusOptions.map((option) => (
//                             <Button
//                                 key={option.status}
//                                 type={status === option.status ? 'primary' : 'default'}
//                                 onClick={() => setStatus(option.status)}
//                                 style={{ marginRight: 4 }}
//                                 disabled={option.status === 'PENDING' || option.status === 'RESOLVED'}
//                             >
//                                 {option.label}
//                             </Button>
//                         ))}
//                     </Form.Item>
//                 )}
//                 {tagetReport.status === 'PENDING' && (
//                     <Form.Item
//                         label={<span style={{ fontWeight: 'bold' }}>Trạng thái</span>}
//                         style={{ marginBottom: '10px' }}
//                     >
//                         {statusOptions.map((option) => (
//                             <Button
//                                 key={option.status}
//                                 type={status === option.status ? 'primary' : 'default'}
//                                 onClick={() => setStatus(option.status)}
//                                 style={{ marginRight: 4 }}
//                             >
//                                 {option.label}
//                             </Button>
//                         ))}
//                     </Form.Item>
//                 )}

//                 <Form.Item
//                     label={<span style={{ fontWeight: 'bold' }}>Người báo cáo</span>}
//                     style={{ marginBottom: '10px' }}
//                 >
//                     <Typography.Text>{tagetReport.reporter?.fullName}</Typography.Text>
//                 </Form.Item>

//                 {tagetReport?.reportType === ReportType.USER && (
//                     <Form.Item
//                         label={<span style={{ fontWeight: 'bold' }}>Người bị báo cáo</span>}
//                         style={{ marginBottom: '10px' }}
//                     >
//                         <Typography.Text>{tagetReport.targetUser?.fullName}</Typography.Text>
//                     </Form.Item>
//                 )}

//                 {tagetReport?.reportType === ReportType.POST && (
//                     <>
//                         <Form.Item
//                             label={<span style={{ fontWeight: 'bold' }}>Người đăng bài viết bị báo cáo</span>}
//                             style={{ marginBottom: '10px' }}
//                         >
//                             <Typography.Text>{tagetReport.targetPost?.user?.fullName}</Typography.Text>
//                         </Form.Item>
//                         <Form.Item
//                             label={<span style={{ fontWeight: 'bold' }}>Bài viết bị báo cáo</span>}
//                             style={{ marginBottom: '10px' }}
//                         >
//                             <Typography.Text>{tagetReport.targetPost?.content}</Typography.Text>
//                         </Form.Item>
//                         {status == 'RESOLVED' && tagetReport.status != 'RESOLVED' && (
//                             <Form.Item
//                                 label={<span style={{ fontWeight: 'bold' }}>Gỡ bài viết</span>}
//                                 style={{ marginBottom: '10px' }}
//                             >
//                                 <Button
//                                     type={btnCheckDelete ? 'primary' : 'default'}
//                                     onClick={() => setBtnCheckDelete(!btnCheckDelete)}
//                                     style={{ marginRight: 4 }}
//                                 >
//                                     Có
//                                 </Button>
//                                 <Button
//                                     type={!btnCheckDelete ? 'primary' : 'default'}
//                                     onClick={() => setBtnCheckDelete(!btnCheckDelete)}
//                                     style={{ marginRight: 4 }}
//                                 >
//                                     Không
//                                 </Button>
//                             </Form.Item>
//                         )}
//                     </>
//                 )}

//                 {tagetReport?.reportType === ReportType.COMMENT && (
//                     <>
//                         <Form.Item
//                             label={<span style={{ fontWeight: 'bold' }}>Người đăng bình luận bị báo cáo</span>}
//                             style={{ marginBottom: '10px' }}
//                         >
//                             <Typography.Text>{tagetReport.targetComment?.user?.fullName}</Typography.Text>
//                         </Form.Item>
//                         <Form.Item
//                             label={<span style={{ fontWeight: 'bold' }}>Bình luận bị báo cáo</span>}
//                             style={{ marginBottom: '10px' }}
//                         >
//                             <Typography.Text>{tagetReport.targetComment?.content}</Typography.Text>
//                         </Form.Item>
//                         {status == 'RESOLVED' && tagetReport.status != 'RESOLVED' && (
//                             <Form.Item
//                                 label={<span style={{ fontWeight: 'bold' }}>Gỡ bình luận</span>}
//                                 style={{ marginBottom: '10px' }}
//                             >
//                                 <Button
//                                     type={btnCheckDelete ? 'primary' : 'default'}
//                                     onClick={() => setBtnCheckDelete(!btnCheckDelete)}
//                                     style={{ marginRight: 4 }}
//                                 >
//                                     Có
//                                 </Button>
//                                 <Button
//                                     type={!btnCheckDelete ? 'primary' : 'default'}
//                                     onClick={() => setBtnCheckDelete(!btnCheckDelete)}
//                                     style={{ marginRight: 4 }}
//                                 >
//                                     Không
//                                 </Button>
//                             </Form.Item>
//                         )}
//                     </>
//                 )}
//                 {tagetReport?.reportType === ReportType.GROUP && (
//                     <>
//                         <Form.Item
//                             label={<span style={{ fontWeight: 'bold' }}>Nhóm bị báo cáo</span>}
//                             style={{ marginBottom: '10px' }}
//                         >
//                             <Typography.Text>{tagetReport?.targetGroup?.name}</Typography.Text>
//                         </Form.Item>
//                         {status == 'RESOLVED' && tagetReport.status != 'RESOLVED' && (
//                             <Form.Item
//                                 label={<span style={{ fontWeight: 'bold' }}>Giải tán nhóm</span>}
//                                 style={{ marginBottom: '10px' }}
//                             >
//                                 <Button
//                                     type={btnCheckDelete ? 'primary' : 'default'}
//                                     onClick={() => setBtnCheckDelete(!btnCheckDelete)}
//                                     style={{ marginRight: 4 }}
//                                 >
//                                     Có
//                                 </Button>
//                                 <Button
//                                     type={!btnCheckDelete ? 'primary' : 'default'}
//                                     onClick={() => setBtnCheckDelete(!btnCheckDelete)}
//                                     style={{ marginRight: 4 }}
//                                 >
//                                     Không
//                                 </Button>
//                             </Form.Item>
//                         )}
//                     </>
//                 )}

//                 <Form.Item
//                     label={<span style={{ fontWeight: 'bold' }}>Ngày tạo</span>}
//                     style={{ marginBottom: '10px' }}
//                 >
//                     <Typography.Text>{new Date(tagetReport.dateCreatedAt).toLocaleString()}</Typography.Text>
//                 </Form.Item>

//                 {tagetReport.resolvedAt && (
//                     <Form.Item
//                         label={<span style={{ fontWeight: 'bold' }}>Ngày giải quyết</span>}
//                         style={{ marginBottom: '10px' }}
//                     >
//                         <Typography.Text>{new Date(tagetReport.resolvedAt).toLocaleString()}</Typography.Text>
//                     </Form.Item>
//                 )}

//                 <Form.Item style={{ marginBottom: '4px' }}>
//                     {(tagetReport.status === 'RESOLVED' || tagetReport.status === 'REJECTED') && (
//                         <Button type='primary' disabled block>
//                             Cập nhật
//                         </Button>
//                     )}
//                     {tagetReport.status === 'PENDING' && (
//                         <Button type='primary' onClick={() => handleStatusChange()} loading={loading} block>
//                             Cập nhật
//                         </Button>
//                     )}
//                 </Form.Item>
//             </Form>
//         </Modal>
//     )
// }

// export default UpdateReportDialog
