import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

// Định nghĩa kiểu dữ liệu cho user
interface User {
    id: number
    name: string
    email: string
}

// Props nhận danh sách user đã lọc
interface UsersTableProps {
    users: User[]
}

const AdminUsersTable: React.FC<UsersTableProps> = ({ users }) => {
    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '4%' }}>
                            <b>Id</b>
                        </TableCell>
                        <TableCell sx={{ width: '32%' }}>
                            <b>Name</b>
                        </TableCell>
                        <TableCell sx={{ width: '32%' }}>
                            <b>Email</b>
                        </TableCell>
                        <TableCell sx={{ width: '32%', textAlign: 'right', alignItems: 'center', paddingRight: 4 }}>
                            <b>Actions</b>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell sx={{ width: '4%' }}>{user.id}</TableCell>
                            <TableCell sx={{ width: '32%' }}>{user.name}</TableCell>
                            <TableCell sx={{ width: '32%' }}>{user.email}</TableCell>
                            <TableCell sx={{ width: '32%', textAlign: 'right', alignItems: 'center' }}>
                                <IconButton color='primary'>
                                    <FontAwesomeIcon icon={faEdit} />
                                </IconButton>
                                <span style={{ marginLeft: 5 }}>Edit</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default AdminUsersTable
