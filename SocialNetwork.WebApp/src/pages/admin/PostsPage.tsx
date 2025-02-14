import React, { useEffect, useState, useMemo } from 'react'
import { Toolbar, Button, InputAdornment, TextField, Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import adminService from '../../services/adminService'
import ConfirmDeleteDialog from '../../components/dialogs/ConfirmDeleteDialog'
import CustomTablePagination from '../../layouts/AdminLayout/components/TablePagination'
import { PostResource } from '../../types/post'
import AdminPostsTable from '../../layouts/AdminLayout/components/AdminPostTable'
import { toast } from 'react-toastify'

const PostsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [allPost, setAllPost] = useState<PostResource[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteType, setDeleteType] = useState<'delete-all' | 'delete-selected' | null>(null)
    const [selectedPosts, setSelectedPosts] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const response = await adminService.getAllPost()
            if (response.isSuccess) {
                setAllPost(response.data)
            }
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handlePostSelect = (selected: string[]) => {
        setSelectedPosts(selected)
    }

    const removeDiacritics = (str: string) => {
        return str?.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    }

    const filteredPosts = useMemo(() => {
        const normalizedSearchTerm = removeDiacritics(searchTerm)
        return allPost.filter((post) =>
            [post.content, post.postType, post.privacy, post.user.fullName, post.user.email].some((field) =>
                removeDiacritics(field || '').includes(normalizedSearchTerm)
            )
        )
    }, [searchTerm, allPost])

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
            if (deleteType === 'delete-selected' && selectedPosts.length === 0) {
                toast.error('Không có bài viết nào được chọn')
            }
            if (deleteType === 'delete-all' && allPost.length === 0) {
                toast.error('Không có bài viết tồn tại')
            }
            if (deleteType === 'delete-all' && allPost.length > 0) {
                const response = await adminService.DeleteAllPost()
                if (response.isSuccess) {
                    toast.success('Xóa tất cả bài viết thành công')
                    await fetchPosts()
                }
            } else if (deleteType === 'delete-selected' && selectedPosts.length > 0) {
                const response = await adminService.DeleteManyPost(selectedPosts)
                if (response.isSuccess) {
                    toast.success('Xóa các bài viết đã chọn thành công')
                    await fetchPosts()
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
                <Toolbar sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                    <Button variant='contained' color='warning' onClick={() => handleOpenDialog('delete-all')}>
                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: 5 }} /> Xóa tất cả bài viết
                    </Button>
                    <Button variant='contained' color='warning' onClick={() => handleOpenDialog('delete-selected')}>
                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: 5 }} /> Xóa các bài viết đã chọn
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
                    (filteredPosts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', alignItems: 'center', fontSize: '24px', marginTop: 20 }}>
                            Không có bài viết nào tồn tại
                        </Box>
                    ) : (
                        <AdminPostsTable
                            posts={filteredPosts}
                            onPostSelect={handlePostSelect}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            fetchPosts={fetchPosts}
                        />
                    ))}
            </Box>
            <CustomTablePagination
                count={allPost.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10))
                    setPage(0)
                }}
            />
            <ConfirmDeleteDialog
                title={'bài viết'}
                dialogOpen={dialogOpen}
                deleteType={deleteType}
                handleCloseDialog={handleCloseDialog}
                handleConfirmDelete={handleConfirmDelete}
            />
        </Box>
    )
}

export default PostsPage
