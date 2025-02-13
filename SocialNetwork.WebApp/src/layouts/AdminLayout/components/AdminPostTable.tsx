import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import CustomTablePagination from './TablePagination'
import { PostResource } from '../../../types/post'

type PostTableProps = {
    posts: PostResource[]
}

const AdminPostsTable: React.FC<PostTableProps> = ({ posts }) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const paginatedPosts = posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TableContainer sx={{ flex: 1, overflow: 'hidden' }}>
                <Table stickyHeader sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '4%', minWidth: 50, textAlign: 'center' }}>
                                <b>STT</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 150 }}>
                                <b>Nội dung </b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 150 }}>
                                <b>Người đăng</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 100 }}>
                                <b>Ngày tạo</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 120 }}>
                                <b>Kiểu bài viết</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 150 }}>
                                <b>Quyền bài viết</b>
                            </TableCell>
                            <TableCell sx={{ width: '10%', minWidth: 120, textAlign: 'right', paddingRight: 4 }}>
                                <b>Thao tác</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedPosts.map((post, index) => (
                            <TableRow key={post.id} sx={{ height: 50 }}>
                                <TableCell sx={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{post.content}</TableCell>
                                <TableCell>{post.user.fullName}</TableCell>
                                <TableCell>
                                    {post.createdAt ? dayjs(post.createdAt).format('DD/MM/YYYY') : '-'}
                                </TableCell>
                                <TableCell>{post.postType}</TableCell>
                                <TableCell>{post.privacy}</TableCell>
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
                count={posts.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 5))
                    setPage(0)
                }}
            />
        </Paper>
    )
}

export default AdminPostsTable
