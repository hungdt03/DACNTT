import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

// Định nghĩa kiểu dữ liệu cho bài viết
interface Post {
    id: number
    user: string
    title: string
}

// Props nhận danh sách bài viết đã lọc
interface PostsTableProps {
    posts: Post[]
}

const AdminPostsTable: React.FC<PostsTableProps> = ({ posts }) => {
    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '4%' }}>
                            <b>Id</b>
                        </TableCell>
                        <TableCell sx={{ width: '32%' }}>
                            <b>User</b>
                        </TableCell>
                        <TableCell sx={{ width: '32%' }}>
                            <b>Title</b>
                        </TableCell>
                        <TableCell sx={{ width: '32%', textAlign: 'right', alignItems: 'center', paddingRight: 4 }}>
                            <b>Actions</b>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell sx={{ width: '4%' }}>{post.id}</TableCell>
                            <TableCell sx={{ width: '32%' }}>{post.user}</TableCell>
                            <TableCell sx={{ width: '32%' }}>{post.title}</TableCell>
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

export default AdminPostsTable
