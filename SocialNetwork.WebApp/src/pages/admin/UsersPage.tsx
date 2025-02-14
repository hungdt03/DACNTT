import React, { useEffect, useState, useMemo } from 'react'
import {
    Toolbar,
    Button,
    InputAdornment,
    TextField,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Menu
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faCircleChevronDown, faLock, faSearch, faTrashAlt, faUnlock } from '@fortawesome/free-solid-svg-icons'
import AdminUsersTable from '../../layouts/AdminLayout/components/AdminUserTable'
import { UserResource } from '../../types/user'
import adminService from '../../services/adminService'
import ConfirmDeleteDialog from '../../components/dialogs/ConfirmDeleteDialog'
import CustomTablePagination from '../../layouts/AdminLayout/components/TablePagination'
import AddAccountDialog from '../../components/dialogs/AddAccountDialog'
import { toast } from 'react-toastify'

const UsersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [allUser, setAllUser] = useState<UserResource[]>([])
    const [genderFilter, setGenderFilter] = useState('')
    const [isLockFilter, setIsLockFilter] = useState('')
    const [isVerificationFilter, setIsVerificationFilter] = useState('')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteType, setDeleteType] = useState<
        'delete-all' | 'delete-selected' | 'lock-selected' | 'unlock-selected' | null
    >(null)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await adminService.getAllUser()
            if (response.isSuccess) {
                setAllUser(response.data)
            }
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleUserSelect = (selected: string[]) => {
        setSelectedUsers(selected)
    }

    const removeDiacritics = (str: string) => {
        return str?.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    }

    const filteredUsers = useMemo(() => {
        const normalizedSearchTerm = removeDiacritics(searchTerm)
        return allUser.filter(
            (user) =>
                [user.fullName, user.email, user.phoneNumber, user.location].some((field) =>
                    removeDiacritics(field || '').includes(normalizedSearchTerm)
                ) &&
                (genderFilter ? user.gender === genderFilter : true) &&
                (isLockFilter !== '' ? user.isLock === (isLockFilter === 'true') : true) &&
                (isVerificationFilter !== '' ? user.isverification === (isVerificationFilter === 'true') : true)
        )
    }, [searchTerm, allUser, genderFilter, isLockFilter, isVerificationFilter])

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleOpenSignUpDialog = () => setIsSignUpDialogOpen(true)
    const handleCloseSignUpDialog = () => setIsSignUpDialogOpen(false)

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleOpenDialog = (type: 'delete-all' | 'delete-selected' | 'lock-selected' | 'unlock-selected') => {
        setDeleteType(type)
        setDialogOpen(true)
        handleCloseMenu()
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setDeleteType(null)
    }

    const handleConfirmDelete = async () => {
        setLoading(true)
        try {
            if (deleteType === 'delete-all') {
                const response = await adminService.DeleteAllAccount()
                if (response.isSuccess) {
                    toast.success('Xóa tất cả tài khoản thành công')
                    await fetchUsers()
                }
            }
            if (deleteType === 'lock-selected') {
                const response = await adminService.lockAndUnlockManyAccount(selectedUsers, '1')
                if (response.isSuccess) {
                    toast.success('Khóa ' + response.message)
                    await fetchUsers()
                }
            }
            if (deleteType === 'unlock-selected') {
                const response = await adminService.lockAndUnlockManyAccount(selectedUsers, '2')
                if (response.isSuccess) {
                    toast.success('Mở khóa ' + response.message)
                    await fetchUsers()
                }
            } else if (deleteType === 'delete-selected') {
                const response = await adminService.DeleteManyAccount(selectedUsers)
                if (response.isSuccess) {
                    toast.success('Xóa các tài khoản đã chọn thành công')
                    await fetchUsers()
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
                <FormControl size='small' variant='outlined' sx={{ minWidth: 110, width: 'fit-content' }}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                        <MenuItem value=''>Tất cả</MenuItem>
                        <MenuItem value='MALE'>Nam</MenuItem>
                        <MenuItem value='FEMALE'>Nữ</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 160, width: 'fit-content' }}>
                    <InputLabel>Khóa tài khoản</InputLabel>
                    <Select value={isLockFilter} onChange={(e) => setIsLockFilter(e.target.value)}>
                        <MenuItem value=''>Tất cả</MenuItem>
                        <MenuItem value='true'>Đã khóa</MenuItem>
                        <MenuItem value='false'>Chưa khóa</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 190, width: 'fit-content' }}>
                    <InputLabel>Xác thực tài khoản</InputLabel>
                    <Select value={isVerificationFilter} onChange={(e) => setIsVerificationFilter(e.target.value)}>
                        <MenuItem value=''>Tất cả</MenuItem>
                        <MenuItem value='true'>Đã xác thực</MenuItem>
                        <MenuItem value='false'>Chưa xác thực</MenuItem>
                    </Select>
                </FormControl>
                <Toolbar sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                    <Button variant='contained' color='primary' onClick={handleOpenMenu}>
                        <FontAwesomeIcon icon={faCircleChevronDown} style={{ marginRight: 5 }} />
                        Thêm thao tác
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                        <MenuItem onClick={() => handleOpenDialog('delete-all')}>
                            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: 10, color: 'red' }} />
                            Xóa tất cả tài khoản
                        </MenuItem>
                        <MenuItem onClick={() => handleOpenDialog('delete-selected')}>
                            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: 10, color: 'red' }} />
                            Xóa các tài khoản đã chọn
                        </MenuItem>
                        <MenuItem onClick={() => handleOpenDialog('lock-selected')}>
                            <FontAwesomeIcon icon={faLock} style={{ marginRight: 10, color: 'red' }} />
                            Khóa các tài khoản đã chọn
                        </MenuItem>
                        <MenuItem onClick={() => handleOpenDialog('unlock-selected')}>
                            <FontAwesomeIcon icon={faUnlock} style={{ marginRight: 10, color: 'green' }} />
                            Mở khóa các tài khoản đã chọn
                        </MenuItem>
                    </Menu>
                    <Button variant='contained' color='secondary' onClick={() => handleOpenSignUpDialog()}>
                        <FontAwesomeIcon icon={faAdd} style={{ marginRight: 5 }} /> Thêm tài khoản
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
                    (filteredUsers.length === 0 ? (
                        <Box sx={{ textAlign: 'center', alignItems: 'center', fontSize: '24px', marginTop: 20 }}>
                            Không có tài khoản nào tồn tại
                        </Box>
                    ) : (
                        <AdminUsersTable
                            users={filteredUsers}
                            onUserSelect={handleUserSelect}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            fetchUsers={fetchUsers}
                        />
                    ))}
            </Box>
            <CustomTablePagination
                count={allUser.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10))
                    setPage(0)
                }}
            />
            <ConfirmDeleteDialog
                title={'tài khoản'}
                dialogOpen={dialogOpen}
                deleteType={deleteType}
                handleCloseDialog={handleCloseDialog}
                handleConfirmDelete={handleConfirmDelete}
            />
            <AddAccountDialog
                isVisible={isSignUpDialogOpen}
                onClose={handleCloseSignUpDialog}
                fetchUsers={fetchUsers}
            />
        </Box>
    )
}

export default UsersPage
