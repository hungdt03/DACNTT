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
    Typography
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { UserResource } from '../../../types/user'
import CustomTablePagination from './TablePagination'

type UsersTableProps = {
    users: UserResource[]
    onUserSelect: (selectedUsers: string[]) => void
}

type Order = 'asc' | 'desc'

const AdminUsersTable: React.FC<UsersTableProps> = ({ users, onUserSelect }) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selected, setSelected] = useState<string[]>([])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof UserResource>('fullName')
    const [expanded, setExpanded] = useState<string | null>(null)

    const handleRequestSort = (property: keyof UserResource) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newSelected = event.target.checked ? users.map((user) => user.id) : []
        setSelected(newSelected)
        onUserSelect(newSelected)
    }

    const handleClick = (id: string) => {
        setSelected((prevSelected) => {
            let newSelected = prevSelected.includes(id)
                ? prevSelected.filter((item) => item !== id)
                : [...prevSelected, id]
            onUserSelect(newSelected)
            return newSelected
        })
    }

    const handleExpandClick = (id: string) => {
        setExpanded(expanded === id ? null : id)
    }

    const sortedUsers = [...users].sort((a, b) => {
        let aValue = a[orderBy]
        let bValue = b[orderBy]

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })
    const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell padding='checkbox'>
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < users.length}
                                    checked={users.length > 0 && selected.length === users.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>

                            {['fullName', 'email', 'phoneNumber', 'gender', 'dateOfBirth'].map((column) => (
                                <TableCell key={column} sortDirection={orderBy === column ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === column}
                                        direction={orderBy === column ? order : 'asc'}
                                        onClick={() => handleRequestSort(column as keyof UserResource)}
                                    >
                                        <b>
                                            {column === 'fullName'
                                                ? 'Tên'
                                                : column === 'gender'
                                                  ? 'Giới tính'
                                                  : column === 'email'
                                                    ? 'Email'
                                                    : column === 'phoneNumber'
                                                      ? 'Số điện thoại'
                                                      : column === 'dateOfBirth'
                                                        ? 'Ngày sinh'
                                                        : column}
                                        </b>
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell sx={{ textAlign: 'right' }}>
                                <b>Thao tác</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <React.Fragment key={user.id}>
                                <TableRow sx={{ height: 50 }}>
                                    <TableCell>
                                        <IconButton size='small' onClick={() => handleExpandClick(user.id)}>
                                            <FontAwesomeIcon icon={expanded === user.id ? faMinus : faPlus} />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            checked={selected.includes(user.id)}
                                            onClick={() => handleClick(user.id)}
                                        />
                                    </TableCell>

                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNumber === null ? 'Không có' : user.phoneNumber}</TableCell>
                                    <TableCell>
                                        {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                    </TableCell>
                                    <TableCell>
                                        {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : '-'}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <IconButton color='primary' size='small'>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </IconButton>
                                        <span style={{ width: 5, display: 'inline-block' }}></span>
                                        <IconButton color='error' size='small'>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ padding: 0, paddingLeft: 3 }}>
                                        <Collapse in={expanded === user.id} timeout='auto' unmountOnExit>
                                            <Typography
                                                variant='subtitle2'
                                                sx={{ paddingBottom: '1px', fontWeight: 'bold', paddingTop: 1 }}
                                            >
                                                Chi tiết người dùng: {user.fullName}
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
                                                    <Typography variant='body2'>{`Ngày tham gia: ${user.dateJoined ? dayjs(user.dateJoined).format('DD/MM/YYYY') : ''}`}</Typography>
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

            <CustomTablePagination
                count={users.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10))
                    setPage(0)
                }}
            />
        </Paper>
    )
}

export default AdminUsersTable
