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
import { UserResource } from '../../../types/user'
import UserLockButton from './UserLockButton'
import adminService from '../../../services/adminService'
import { toast } from 'react-toastify'
import { Popconfirm } from 'antd'

type UsersTableProps = {
    users: UserResource[]
    onUserSelect: (selectedUsers: string[]) => void
    rowsPerPage: number
    page: number
    fetchUsers: () => void
}

type Order = 'asc' | 'desc'

const AdminUsersTable: React.FC<UsersTableProps> = ({ users, onUserSelect, rowsPerPage, page, fetchUsers }) => {
    const [selected, setSelected] = useState<string[]>([])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof UserResource>('fullName')
    const [expanded, setExpanded] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    const handleConfirmDelete = (id: string) => {
        handleDeleteClick(id)
        setOpen(false)
    }
    const handleRequestSort = (property: keyof UserResource) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelected = event.target.checked ? users.map((user) => user.id) : []
        setSelected(newSelected)
        onUserSelect(newSelected)
    }

    const handleClick = (id: string) => {
        const newSelected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
        setSelected(newSelected)
        onUserSelect(newSelected)
    }

    const handleExpandClick = (id: string) => {
        setExpanded(expanded === id ? null : id)
    }
    const handleDeleteClick = async (id: string) => {
        const response = await adminService.DeleteOneAccount(id)
        if (response.isSuccess) {
            toast.success('Xóa tài khoản thành công')
            fetchUsers()
        }
    }

    const sortedUsers = [...users].sort((a, b) => {
        const aValue = a[orderBy]
        const bValue = b[orderBy]

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const columns = [
        { key: 'fullName', label: 'Tên' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Số điện thoại' },
        { key: 'gender', label: 'Giới tính' },
        { key: 'dateOfBirth', label: 'Ngày sinh' }
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
                                    indeterminate={selected.length > 0 && selected.length < users.length}
                                    checked={users.length > 0 && selected.length === users.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>

                            {columns.map((column) => (
                                <TableCell key={column.key} sortDirection={orderBy === column.key ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === column.key}
                                        direction={orderBy === column.key ? order : 'asc'}
                                        onClick={() => handleRequestSort(column.key as keyof UserResource)}
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
                        {users.length > 0 &&
                            paginatedUsers.map((user, index) => (
                                <React.Fragment key={user.id}>
                                    <TableRow sx={{ height: 50 }}>
                                        <TableCell>
                                            <IconButton size='small' onClick={() => handleExpandClick(user.id)}>
                                                <FontAwesomeIcon icon={expanded === user.id ? faMinus : faPlus} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell padding='checkbox'>
                                            <Checkbox
                                                checked={selected.includes(user.id)}
                                                onClick={() => handleClick(user.id)}
                                            />
                                        </TableCell>

                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNumber || 'Không có'}</TableCell>
                                        <TableCell>
                                            {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                        </TableCell>
                                        <TableCell>
                                            {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : '-'}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'right' }}>
                                            <UserLockButton user={user} />
                                            <span style={{ width: 10, display: 'inline-block' }}></span>
                                            <Popconfirm
                                                onConfirm={() => handleConfirmDelete(user.id)}
                                                title='Xác nhận xóa'
                                                description='Bạn có chắc chắn muốn xóa tài khoản này?'
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
                                            <Collapse in={expanded === user.id} timeout='auto' unmountOnExit>
                                                <Typography
                                                    variant='subtitle2'
                                                    sx={{
                                                        paddingBottom: '1px',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.9rem',
                                                        paddingTop: 1
                                                    }}
                                                >
                                                    Chi tiết tài khoản: {user.fullName}
                                                </Typography>
                                                <Grid container spacing={1} sx={{ fontSize: '0.85rem' }}>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số bài viết: ${user.postCount}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số người theo dõi: ${user.followerCount}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số người đang theo dõi: ${user.followingCount}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số bạn bè: ${user.friendCount}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>
                                                            {`Địa chỉ: ${user.location || 'Chưa có'}`}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Ngày tham gia: ${dayjs(user.dateJoined).format('DD/MM/YYYY')}`}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default AdminUsersTable
