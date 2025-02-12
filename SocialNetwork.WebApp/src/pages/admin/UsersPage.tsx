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
import { faCircleChevronDown, faFileExport, faSearch } from '@fortawesome/free-solid-svg-icons'
import AdminUsersTable from '../../layouts/AdminLayout/components/AdminUserTable'
import { UserResource } from '../../types/user'
import adminService from '../../services/adminService'
import ConfirmDeleteDialog from '../../components/dialogs/ConfirmDeleteDialog'

const UsersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [allUser, setAllUser] = useState<UserResource[]>([])
    const [genderFilter, setGenderFilter] = useState('')
    const [isOnlineFilter, setIsOnlineFilter] = useState('')
    const [isVerificationFilter, setIsVerificationFilter] = useState('')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteType, setDeleteType] = useState<'all' | 'selected' | null>(null)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await adminService.getAllUser()
            if (response.isSuccess) {
                setAllUser(response.data)
            }
        }
        fetchUsers()
    }, [])

    const handleUserSelect = (selected: string[]) => {
        setSelectedUsers(selected)
        console.log('Người dùng được chọn:', selected)
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
                (isOnlineFilter !== '' ? user.isOnline === (isOnlineFilter === 'true') : true) &&
                (isVerificationFilter !== '' ? user.isverification === (isVerificationFilter === 'true') : true)
        )
    }, [searchTerm, allUser, genderFilter, isOnlineFilter, isVerificationFilter])

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleOpenDialog = (type: 'all' | 'selected') => {
        setDeleteType(type)
        setDialogOpen(true)
        handleCloseMenu()
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setDeleteType(null)
    }

    const handleConfirmDelete = () => {
        if (deleteType === 'all') {
            console.log('Xóa tất cả người dùng')
            // Gọi API xóa tất cả người dùng ở đây
        } else if (deleteType === 'selected') {
            console.log('Xóa các người dùng được chọn')
            // Gọi API xóa người dùng được chọn ở đây
        }
        handleCloseDialog()
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', marginBottom: 2 }}>
                <TextField
                    variant='outlined'
                    size='small'
                    placeholder='Tìm kiếm'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ backgroundColor: 'white', borderRadius: '4px', width: '250px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <FontAwesomeIcon icon={faSearch} style={{ color: '#757575' }} />
                            </InputAdornment>
                        )
                    }}
                />
                <FormControl size='small' variant='outlined' sx={{ minWidth: 120, width: 'fit-content' }}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                        <MenuItem value=''>Tất cả</MenuItem>
                        <MenuItem value='MALE'>Nam</MenuItem>
                        <MenuItem value='FEMALE'>Nữ</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 120, width: 'fit-content' }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select value={isOnlineFilter} onChange={(e) => setIsOnlineFilter(e.target.value)}>
                        <MenuItem value=''>Tất cả</MenuItem>
                        <MenuItem value='true'>Đang hoạt động</MenuItem>
                        <MenuItem value='false'>Ngoại tuyến</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 180, width: 'fit-content' }}>
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
                        <MenuItem onClick={() => handleOpenDialog('all')}>Xóa tất cả</MenuItem>
                        <MenuItem onClick={() => handleOpenDialog('selected')}>Xóa các người dùng được chọn</MenuItem>
                    </Menu>
                    <Button variant='contained' color='secondary'>
                        <FontAwesomeIcon icon={faFileExport} style={{ marginRight: 5 }} /> Xuất file
                    </Button>
                </Toolbar>
            </Box>

            <Box sx={{ overflow: 'auto', height: '100%' }}>
                <AdminUsersTable users={filteredUsers} onUserSelect={handleUserSelect} />
            </Box>

            <ConfirmDeleteDialog
                title={'người dùng'}
                dialogOpen={dialogOpen}
                deleteType={deleteType}
                handleCloseDialog={handleCloseDialog}
                handleConfirmDelete={handleConfirmDelete}
            />
        </Box>
    )
}

export default UsersPage
