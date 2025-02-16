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
import adminService from '../../../services/adminService'
import { toast } from 'react-toastify'
import { Popconfirm } from 'antd'
import { PostResource } from '../../../types/post'
import { PostType } from '../../../enums/post-type'

type PostsTableProps = {
    posts: PostResource[]
    onPostSelect: (selectedPosts: string[]) => void
    rowsPerPage: number
    page: number
    fetchPosts: () => void
}

type Order = 'asc' | 'desc'

const AdminPostsTable: React.FC<PostsTableProps> = ({ posts, onPostSelect, rowsPerPage, page, fetchPosts }) => {
    const [selected, setSelected] = useState<string[]>([])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof PostResource>('content')
    const [expanded, setExpanded] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    const handleConfirmDelete = (id: string) => {
        handleDeleteClick(id)
        setOpen(false)
    }
    const handleRequestSort = (property: keyof PostResource) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelected = event.target.checked ? posts.map((post) => post.id) : []
        setSelected(newSelected)
        onPostSelect(newSelected)
    }

    const handleClick = (id: string) => {
        const newSelected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
        setSelected(newSelected)
        onPostSelect(newSelected)
    }

    const handleExpandClick = (id: string) => {
        setExpanded(expanded === id ? null : id)
    }
    const handleDeleteClick = async (id: string) => {
        const response = await adminService.DeleteOnePost(id)
        if (response.isSuccess) {
            toast.success('Xóa bài viết thành công')
            fetchPosts()
        }
    }
    const getPostTypeLabel = (postType: string) => {
        switch (postType) {
            case PostType.GROUP_POST:
                return 'Bài viết trong nhóm'
            case PostType.ORIGINAL_POST:
                return 'Bài viết gốc'
            case PostType.SHARE_POST:
                return 'Bài viết chia sẻ'
            case PostType.GROUP_POST_SHARE:
                return 'Bài viết chia sẻ trong nhóm'
            default:
                return 'Bài viết'
        }
    }

    const sortedPosts = [...posts].sort((a, b) => {
        const aValue = a[orderBy]
        const bValue = b[orderBy]

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedPosts = sortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const columns = [
        { key: 'content', label: 'Nội dung' },
        { key: 'createdAt', label: 'Ngày tạo' },
        { key: 'user', label: 'Người đăng' },
        { key: 'postType', label: 'Kiểu bài viết' },
        { key: 'privacy', label: 'Chế độ bài viết' }
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
                                    indeterminate={selected.length > 0 && selected.length < posts.length}
                                    checked={posts.length > 0 && selected.length === posts.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>

                            {columns.map((column) => (
                                <TableCell key={column.key} sortDirection={orderBy === column.key ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === column.key}
                                        direction={orderBy === column.key ? order : 'asc'}
                                        onClick={() => handleRequestSort(column.key as keyof PostResource)}
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
                        {posts.length > 0 &&
                            paginatedPosts.map((post, index) => (
                                <React.Fragment key={post.id}>
                                    <TableRow sx={{ height: 50 }}>
                                        <TableCell>
                                            <IconButton size='small' onClick={() => handleExpandClick(post.id)}>
                                                <FontAwesomeIcon icon={expanded === post.id ? faMinus : faPlus} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell padding='checkbox'>
                                            <Checkbox
                                                checked={selected.includes(post.id)}
                                                onClick={() => handleClick(post.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{post.content}</TableCell>
                                        <TableCell>
                                            {post.createdAt ? dayjs(post.createdAt).format('DD/MM/YYYY') : '-'}
                                        </TableCell>
                                        <TableCell>{post.user.fullName}</TableCell>

                                        <TableCell>{getPostTypeLabel(post.postType)}</TableCell>

                                        <TableCell>
                                            {post.privacy === 'PUBLIC'
                                                ? 'Công khai'
                                                : post.privacy === 'PRIVATE'
                                                  ? 'Riêng tư'
                                                  : 'Khác'}
                                        </TableCell>

                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <span style={{ width: 10, display: 'contents' }}></span>
                                            <Popconfirm
                                                onConfirm={() => handleConfirmDelete(post.id)}
                                                title='Xác nhận xóa'
                                                description='Bạn có chắc chắn muốn xóa bài viết này?'
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
                                            <Collapse in={expanded === post.id} timeout='auto' unmountOnExit>
                                                <Typography
                                                    variant='subtitle2'
                                                    sx={{
                                                        paddingBottom: '1px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold',
                                                        paddingTop: 1
                                                    }}
                                                >
                                                    Chi tiết bài viết: {post.content}
                                                </Typography>
                                                <Grid container spacing={1} sx={{ fontSize: '0.85rem' }}>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số lượt chia sẻ: ${post.shares}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số bình luận: ${post.comments}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số cảm xúc : ${post.reactions}`}</Typography>
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

export default AdminPostsTable
