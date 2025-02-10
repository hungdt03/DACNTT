import React, { useEffect, useState, useMemo } from 'react'
import { Toolbar, Button, InputAdornment, TextField, Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileExport, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import adminService from '../../services/adminService'
import { PostResource } from '../../types/post'
import AdminPostTable from '../../layouts/AdminLayout/components/AdminPostTable'

const PostsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [allPost, setAllPost] = useState<PostResource[]>([])

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await adminService.getAllPost()
            if (response.isSuccess) {
                setAllPost(response.data)
                console.log(response.data + 'sssss')
            } else {
                console.log(response.data)
            }
        }
        fetchPosts()
    }, [])
    const removeDiacritics = (str: string) => {
        return str
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
    }

    const filteredPosts = useMemo(() => {
        const normalizedSearchTerm = removeDiacritics(searchTerm)

        return allPost.filter((post) =>
            [post.id, post.content, post.postType].some((field) =>
                removeDiacritics(field || '').includes(normalizedSearchTerm)
            )
        )
    }, [searchTerm, allPost])

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <TextField
                    variant='outlined'
                    size='small'
                    placeholder='Tìm kiếm'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        width: '300px'
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <FontAwesomeIcon icon={faSearch} style={{ color: '#757575' }} />
                            </InputAdornment>
                        )
                    }}
                />

                <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant='contained' color='primary' sx={{ marginRight: 1 }}>
                        <FontAwesomeIcon icon={faFilter} style={{ marginRight: 5 }} /> Lọc
                    </Button>
                    <Button variant='contained' sx={{ marginRight: 1 }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> Thêm bài viết
                    </Button>
                    <Button variant='contained' color='secondary'>
                        <FontAwesomeIcon icon={faFileExport} style={{ marginRight: 5 }} /> Xuất file
                    </Button>
                </Toolbar>
            </Box>

            <Box sx={{ overflow: 'auto', height: '100%' }}>
                <AdminPostTable posts={filteredPosts} />
            </Box>
        </Box>
    )
}

export default PostsPage
