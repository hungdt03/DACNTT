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
import { GroupResource } from '../../types/group'
import AdminGroupsTable from '../../layouts/AdminLayout/components/AdminGroupsTable'

const GroupsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [allGroup, setAllGroup] = useState<GroupResource[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteType, setDeleteType] = useState<'delete-all' | 'delete-selected' | null>(null)
    const [selectedGroups, setSelectedGroups] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [privacyFilter, setPrivacyFilter] = useState('')

    const fetchGroups = async () => {
        setLoading(true)
        try {
            const response = await adminService.getAllGroup()
            if (response.isSuccess) {
                setAllGroup(response.data)
            }
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    const handleGroupSelect = (selected: string[]) => {
        setSelectedGroups(selected)
    }

    const removeDiacritics = (str: string) => {
        return str?.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    }

    const filteredGroups = useMemo(() => {
        const normalizedSearchTerm = removeDiacritics(searchTerm)
        return allGroup.filter(
            (group) =>
                [group.description, group.name, group.privacy].some((field) =>
                    removeDiacritics(field || '').includes(normalizedSearchTerm)
                ) && (privacyFilter != '' ? group.privacy == privacyFilter : true)
        )
    }, [searchTerm, allGroup, privacyFilter])

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
            if (deleteType === 'delete-selected' && selectedGroups.length === 0) {
                toast.error('Không có nhóm nào được chọn')
            }
            if (deleteType === 'delete-all' && allGroup.length === 0) {
                toast.error('Không có nhóm tồn tại')
            }
            if (deleteType === 'delete-all' && allGroup.length > 0) {
                const response = await adminService.DeleteAllGroup()
                if (response.isSuccess) {
                    toast.success('Xóa tất cả nhóm thành công')
                    await fetchGroups()
                }
            } else if (deleteType === 'delete-selected' && selectedGroups.length > 0) {
                const response = await adminService.DeleteManyGroup(selectedGroups)
                if (response.isSuccess) {
                    toast.success('Xóa các nhóm đã chọn thành công')
                    await fetchGroups()
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
                <FormControl size='small' sx={{ minWidth: 150, width: 'fit-content' }}>
                    <InputLabel>Chế độ nhóm</InputLabel>
                    <Select value={privacyFilter} onChange={(e) => setPrivacyFilter(e.target.value)}>
                        <MenuItem value=''>Tất cả</MenuItem>
                        <MenuItem value='PUBLIC'>Công khai</MenuItem>
                        <MenuItem value='PRIVATE'>Riêng tư</MenuItem>
                    </Select>
                </FormControl>
                <Toolbar sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                    <Button variant='contained' color='warning' onClick={() => handleOpenDialog('delete-all')}>
                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: 5 }} /> Xóa tất cả nhóm
                    </Button>
                    <Button variant='contained' color='warning' onClick={() => handleOpenDialog('delete-selected')}>
                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: 5 }} /> Xóa các nhóm đã chọn
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
                    (filteredGroups.length === 0 ? (
                        <Box sx={{ textAlign: 'center', alignItems: 'center', fontSize: '24px', marginTop: 20 }}>
                            Không có nhóm nào tồn tại
                        </Box>
                    ) : (
                        <AdminGroupsTable
                            groups={filteredGroups}
                            onGroupSelect={handleGroupSelect}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            fetchGroups={fetchGroups}
                        />
                    ))}
            </Box>
            <CustomTablePagination
                count={allGroup.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10))
                    setPage(0)
                }}
            />
            <ConfirmDeleteDialog
                title={'nhóm'}
                dialogOpen={dialogOpen}
                deleteType={deleteType}
                handleCloseDialog={handleCloseDialog}
                handleConfirmDelete={handleConfirmDelete}
            />
        </Box>
    )
}

export default GroupsPage
