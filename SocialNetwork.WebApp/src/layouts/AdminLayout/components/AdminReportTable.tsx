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
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons'
import adminService from '../../../services/adminService'
import { toast } from 'react-toastify'
import { Popconfirm } from 'antd'
import { ReportResource } from '../../../types/report'

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
    const [orderBy, setOrderBy] = useState<keyof ReportResource>('id')
    const [expanded, setExpanded] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

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

    const sortedPosts = [...reports].sort((a, b) => {
        const aValue = a[orderBy]
        const bValue = b[orderBy]

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedPosts = sortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const columns = [
        { key: 'content', label: 'Nội dung' },
        { key: 'createdAt', label: 'Ngày tạo' },
        { key: 'user', label: 'Người đăng' },
        { key: 'postType', label: 'Kiểu bài viết' },
        { key: 'privacy', label: 'Chế độ bài viết' }
    ]

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
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
                        {reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                                    Không có bài viết nào tồn tại
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedPosts.map((report, index) => (
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
                                        <TableCell>{report.reason}</TableCell>
                                        <TableCell>
                                            {report.resolvedAt ? dayjs(report.resolvedAt).format('DD/MM/YYYY') : '-'}
                                        </TableCell>
                                        <TableCell>{report.reason}</TableCell>

                                        <TableCell>{report.reason}</TableCell>

                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <span style={{ width: 10, display: 'contents' }}></span>
                                            <Popconfirm
                                                onConfirm={() => handleConfirmDelete(report.id)}
                                                title='Xác nhận xóa'
                                                description='Bạn có chắc chắn muốn xóa bài viết này?'
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
                                                    style={{ fontSize: 12, padding: '3px 8px', minWidth: 'auto' }}
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
                                                    Chi tiết bài viết: {report.reason}
                                                </Typography>
                                                <Grid container spacing={1} sx={{ fontSize: '0.85rem' }}>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số lượt chia sẻ: ${report.reason}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số bình luận: ${report.reason}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số cảm xúc : ${report.reason}`}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default AdminReportsTable
