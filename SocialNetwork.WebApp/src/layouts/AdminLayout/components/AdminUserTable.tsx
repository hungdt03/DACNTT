import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { UserResource } from '../../../types/user'
import CustomTablePagination from './TablePagination'

type UsersTableProps = {
    users: UserResource[]
}

const AdminUsersTable: React.FC<UsersTableProps> = ({ users }) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '4%', minWidth: 50, textAlign: 'center' }}>
                                <b>STT</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 150 }}>
                                <b>Tên người dùng</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 150 }}>
                                <b>Email</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 100 }}>
                                <b>Giới tính</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 120 }}>
                                <b>Ngày sinh</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 150 }}>
                                <b>Tài khoản đã xóa</b>
                            </TableCell>
                            <TableCell sx={{ width: '10%', minWidth: 120, textAlign: 'right', paddingRight: 4 }}>
                                <b>Thao tác</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map((user, index) => (
                            <TableRow key={user.id} sx={{ height: 50 }}>
                                <TableCell sx={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.gender === null
                                        ? 'Khác'
                                        : user.gender === 'MALE'
                                          ? 'Nam'
                                          : user.gender === 'FEMALE'
                                            ? 'Nữ'
                                            : 'Khác'}
                                </TableCell>
                                <TableCell>
                                    {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : '-'}
                                </TableCell>
                                <TableCell>{user.isDeleted ? 'Đã xóa' : 'Đang sử dụng'}</TableCell>
                                <TableCell sx={{ textAlign: 'left' }}>
                                    <IconButton color='primary' size='small'>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </IconButton>
                                    <span style={{ marginLeft: 5 }}>Sửa</span>
                                </TableCell>
                            </TableRow>
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
