import React, { useState } from 'react'
import dayjs from 'dayjs'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Checkbox,
    TableSortLabel,
    Collapse,
    Grid,
    Typography,
    Button
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'
import adminService from '../../../services/adminService'
import { toast } from 'react-toastify'
import { Popconfirm } from 'antd'
import { ReportResource } from '../../../types/report'
import UpdateReportDialog from '../../../components/dialogs/UpdateReportDialog'
import { ReportType } from '../../../enums/report-type'

type PostsTableProps = {
    reports: ReportResource[]
    onReportSelect: (selectedReports: string[]) => void
    rowsPerPage: number
    page: number
    fetchReports: () => void
}

type Order = 'asc' | 'desc'

const AdminReportsTable: React.FC<PostsTableProps> = ({ reports, onReportSelect, rowsPerPage, page, fetchReports }) => {
    const [selected, setSelected] = useState<string[]>([])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof ReportResource>('dateCreatedAt')
    const [expanded, setExpanded] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
    const [isUpdateReportDialogOpen, setIsOpenUpdateReportDialog] = useState(false)
    const [reportSelected, setReportSelected] = useState<ReportResource>()

    const handleOpenUpdateReportDialog = (reportId: ReportResource) => {
        setReportSelected(reportId)
        setIsOpenUpdateReportDialog(true)
    }

    const handleCloseUpdateReportDialog = () => setIsOpenUpdateReportDialog(false)
    const handleConfirmDelete = (id: string) => {
        handleDeleteClick(id)
        setOpen(false)
    }
    const handleRequestSort = (property: keyof ReportResource) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelected = event.target.checked ? reports.map((report) => report.id) : []
        setSelected(newSelected)
        onReportSelect(newSelected)
    }

    const handleClick = (id: string) => {
        const newSelected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
        setSelected(newSelected)
        onReportSelect(newSelected)
    }

    const handleExpandClick = (id: string) => {
        setExpanded(expanded === id ? null : id)
    }
    const handleDeleteClick = async (id: string) => {
        const response = await adminService.DeleteOneReport(id)
        if (response.isSuccess) {
            toast.success('Xóa báo cáo thành công')
            fetchReports()
        }
    }

    const getReportedAccount = (report: ReportResource) => {
        switch (report.reportType) {
            case ReportType.USER:
                return report.targetUser?.fullName || 'Không xác định'
            case ReportType.GROUP:
                return report.targetGroup?.name || 'Không xác định'
            case ReportType.POST:
                return report.targetPost?.user?.fullName || 'Không xác định'
            case ReportType.COMMENT:
                return report.targetComment?.user?.fullName || 'Không xác định'
            default:
                return 'Không xác định'
        }
    }
    const getTargetLabel = (reportType: string) => {
        switch (reportType) {
            case ReportType.USER:
                return 'Tài khoản'
            case ReportType.GROUP:
                return 'Nhóm'
            case ReportType.POST:
                return 'Tài khoản đăng bài viết'
            case ReportType.COMMENT:
                return 'Tài khoản bình luận'
            default:
                return 'Đối tượng'
        }
    }

    const sortedPosts = [...reports].sort((a, b) => {
        const aValue = a[orderBy]
        const bValue = b[orderBy]

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedReports = sortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const columns = [
        { key: 'reporter', label: 'Tài khoản báo cáo' },
        { key: 'reason', label: 'Lý do báo cáo' },
        { key: 'reportType', label: 'Loại báo cáo' },
        { key: 'status', label: 'Trạng thái' },
        { key: 'dateCreatedAt', label: 'Ngày báo cáo' }
    ]

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TableContainer sx={{ overflow: 'auto' }}>
                <Table stickyHeader sx={{ width: '100%', minHeight: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>
                                <b>STT</b>
                            </TableCell>
                            <TableCell padding='checkbox'>
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < reports.length}
                                    checked={reports.length > 0 && selected.length === reports.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>

                            {columns.map((column) => (
                                <TableCell key={column.key} sortDirection={orderBy === column.key ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === column.key}
                                        direction={orderBy === column.key ? order : 'asc'}
                                        onClick={() => handleRequestSort(column.key as keyof ReportResource)}
                                    >
                                        <b>{column.label}</b>
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell sx={{ textAlign: 'center' }}>
                                <b>Thao tác</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.length > 0 &&
                            paginatedReports.map((report, index) => (
                                <React.Fragment key={report.id}>
                                    <TableRow sx={{ height: 50 }}>
                                        <TableCell>
                                            <IconButton size='small' onClick={() => handleExpandClick(report.id)}>
                                                <FontAwesomeIcon icon={expanded === report.id ? faMinus : faPlus} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell padding='checkbox'>
                                            <Checkbox
                                                checked={selected.includes(report.id)}
                                                onClick={() => handleClick(report.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{report.reporter.fullName}</TableCell>
                                        <TableCell>{report.reason}</TableCell>
                                        <TableCell>
                                            {report.reportType === ReportType.USER
                                                ? 'Tài khoản'
                                                : report.reportType === ReportType.GROUP
                                                  ? 'Nhóm'
                                                  : report.reportType === ReportType.POST
                                                    ? 'Bài viết'
                                                    : 'Bình luận'}
                                        </TableCell>
                                        <TableCell>
                                            {report.status === 'PENDING'
                                                ? 'Chưa xử lý'
                                                : report.status === 'RESOLVED'
                                                  ? 'Đã xử lý'
                                                  : 'Đã từ chối'}
                                        </TableCell>
                                        <TableCell>
                                            {report.dateCreatedAt
                                                ? dayjs(report.dateCreatedAt).format('DD/MM/YYYY')
                                                : '-'}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Button
                                                variant='contained'
                                                color='info'
                                                size='small'
                                                startIcon={<FontAwesomeIcon icon={faPen} style={{ fontSize: 10 }} />}
                                                onClick={() => handleOpenUpdateReportDialog(report)}
                                            >
                                                Sửa
                                            </Button>
                                            <span style={{ width: 10, display: 'inline-block' }}></span>
                                            <Popconfirm
                                                onConfirm={() => handleConfirmDelete(report.id)}
                                                title='Xác nhận xóa'
                                                description='Bạn có chắc chắn muốn xóa báo cáo này?'
                                                cancelText='Không'
                                                okText='Chắc chắn'
                                            >
                                                <Button
                                                    variant='contained'
                                                    color='error'
                                                    size='small'
                                                    startIcon={
                                                        <FontAwesomeIcon icon={faTrash} style={{ fontSize: 10 }} />
                                                    }
                                                >
                                                    Xóa
                                                </Button>
                                            </Popconfirm>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8} sx={{ padding: 0, paddingLeft: 10 }}>
                                            <Collapse in={expanded === report.id} timeout='auto' unmountOnExit>
                                                <Typography
                                                    variant='subtitle2'
                                                    sx={{
                                                        paddingBottom: '1px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold',
                                                        paddingTop: 1
                                                    }}
                                                >
                                                    Chi tiết báo cáo: {report.reason}
                                                </Typography>
                                                <Grid container spacing={1} sx={{ fontSize: '0.85rem' }}>
                                                    <Grid item xs={6} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`${getTargetLabel(report.reportType) + ' bị báo cáo'}: ${getReportedAccount(report)}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>
                                                            Người báo cáo: {report.reporter.fullName}
                                                        </Typography>
                                                    </Grid>
                                                    {report.reportType === ReportType.POST && (
                                                        <Grid item xs={6} sx={{ padding: '2px' }}>
                                                            <Typography variant='body2'>{`Người đăng: ${
                                                                report?.targetPost?.user?.fullName
                                                            }`}</Typography>
                                                        </Grid>
                                                    )}
                                                    {report.reportType === ReportType.COMMENT && (
                                                        <Grid item xs={6} sx={{ padding: '2px' }}>
                                                            <Typography variant='body2'>{`Người đăng: ${
                                                                report?.targetComment?.user.fullName
                                                            }`}</Typography>
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={6} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Ghi chú giải quyết: ${report.resolutionNotes}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Ngày xử lý: ${
                                                            report.resolvedAt
                                                                ? dayjs(report.resolvedAt).format('DD/MM/YYYY')
                                                                : 'Chưa có'
                                                        }`}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                    </TableBody>
                    {reportSelected && (
                        <UpdateReportDialog
                            isVisible={isUpdateReportDialogOpen}
                            onClose={handleCloseUpdateReportDialog}
                            fetchReports={fetchReports}
                            tagetReport={reportSelected}
                        />
                    )}
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default AdminReportsTable
