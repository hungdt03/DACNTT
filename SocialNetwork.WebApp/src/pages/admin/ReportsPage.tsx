import React, { useEffect, useState, useMemo } from 'react'
import {
    Toolbar,
    Button,
    InputAdornment,
    TextField,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import adminService from '../../services/adminService'
import ConfirmDeleteDialog from '../../components/dialogs/ConfirmDeleteDialog'
import CustomTablePagination from '../../layouts/AdminLayout/components/TablePagination'
import { toast } from 'react-toastify'
import { ReportResource } from '../../types/report'
import AdminReportsTable from '../../layouts/AdminLayout/components/AdminReportTable'

const ReportsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [allReport, setAllReport] = useState<ReportResource[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteType, setDeleteType] = useState<'delete-all' | 'delete-selected' | null>(null)
    const [selectedReports, setSelectedReports] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [StatusFilter, setStatusFilter] = useState('')
    const [ReportTypeFilter, setReportTypeFilter] = useState('')

    const fetchReports = async () => {
        setLoading(true)
        try {
            const response = await adminService.getAllReport()
            if (response.isSuccess) {
                setAllReport(response.data)
            }
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const handleReportSelect = (selected: string[]) => {
        setSelectedReports(selected)
    }

    const removeDiacritics = (str: string) => {
        return str?.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    }

    const filteredReports = useMemo(() => {
        const normalizedSearchTerm = removeDiacritics(searchTerm)
        return allReport.filter(
            (report) =>
                [
                    report.reason,
                    report.reportType,
                    report.reporter.fullName,
                    report.targetGroup?.name,
                    report.targetUser?.fullName,
                    report.group?.name
                ].some((field) => removeDiacritics(field || '').includes(normalizedSearchTerm)) &&
                (StatusFilter != '' ? report.status === StatusFilter : true) &&
                (ReportTypeFilter !== '' ? report.reportType === ReportTypeFilter : true)
        )
    }, [searchTerm, allReport, StatusFilter, ReportTypeFilter])

    const handleOpenDialog = (type: 'delete-all' | 'delete-selected') => {
        setDeleteType(type)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setDeleteType(null)
    }

    const handleConfirmDelete = async () => {
        setLoading(true)
        try {
            if (deleteType === 'delete-selected' && selectedReports.length === 0) {
                toast.error('Không có báo cáo nào được chọn')
            }
            if (deleteType === 'delete-all' && allReport.length === 0) {
                toast.error('Không có báo cáo tồn tại')
            }
            if (deleteType === 'delete-all' && allReport.length > 0) {
                const response = await adminService.DeleteAllReport()
                if (response.isSuccess) {
                    toast.success('Xóa tất cả báo cáo thành công')
                    await fetchReports()
                }
            } else if (deleteType === 'delete-selected' && selectedReports.length > 0) {
                const response = await adminService.DeleteManyReport(selectedReports)
                if (response.isSuccess) {
                    toast.success('Xóa các báo cáo đã chọn thành công')
                    await fetchReports()
                }
            }
        } catch (error) {
        } finally {
            setLoading(false)
            handleCloseDialog()
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: 2
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    alignItems: 'center'
                }}
            >
                <TextField
                    variant='outlined'
                    size='small'
                    placeholder='Tìm kiếm'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ backgroundColor: 'white', borderRadius: '4px', width: '225px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <FontAwesomeIcon icon={faSearch} style={{ color: '#757575' }} />
                            </InputAdornment>
                        )
                    }}
                />
                <FormControl size='small' sx={{ minWidth: 160, width: 'fit-content' }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select value={StatusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <MenuItem value=''>Tất cả</MenuItem>
                        <MenuItem value='PENDING'>Chưa xử lý</MenuItem>
                        <MenuItem value='RESOLVED'>Đã xử lý</MenuItem>
                        <MenuItem value='REJECTED'>Đã từ chối</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 190, width: 'fit-content' }}>
                    <InputLabel>Kiểu báo cáo</InputLabel>
                    <Select value={ReportTypeFilter} onChange={(e) => setReportTypeFilter(e.target.value)}>
                        <MenuItem value=''>Tất cả</MenuItem>
                        <MenuItem value='USER'>Tài khoản</MenuItem>
                        <MenuItem value='GROUP'>Nhóm</MenuItem>
                        <MenuItem value='POST'>Bài viết</MenuItem>
                        <MenuItem value='COMMENT'>Bình luận</MenuItem>
                    </Select>
                </FormControl>
                <Toolbar sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                    <Button variant='contained' color='warning' onClick={() => handleOpenDialog('delete-all')}>
                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: 5 }} /> Xóa tất cả báo cáo
                    </Button>
                    <Button variant='contained' color='warning' onClick={() => handleOpenDialog('delete-selected')}>
                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: 5 }} /> Xóa các báo cáo đã chọn
                    </Button>
                </Toolbar>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {!loading &&
                    (filteredReports.length === 0 ? (
                        <Box sx={{ textAlign: 'center', alignItems: 'center', fontSize: '24px', marginTop: 20 }}>
                            Không có báo cáo nào tồn tại
                        </Box>
                    ) : (
                        <AdminReportsTable
                            reports={filteredReports}
                            onReportSelect={handleReportSelect}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            fetchReports={fetchReports}
                        />
                    ))}
            </Box>

            <CustomTablePagination
                count={allReport.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10))
                    setPage(0)
                }}
            />
            <ConfirmDeleteDialog
                title={'báo cáo'}
                dialogOpen={dialogOpen}
                deleteType={deleteType}
                handleCloseDialog={handleCloseDialog}
                handleConfirmDelete={handleConfirmDelete}
            />
        </Box>
    )
}

export default ReportsPage
