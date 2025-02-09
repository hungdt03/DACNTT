import React, { useState } from 'react'
import { Card, Toolbar, Button, Box, InputAdornment, TextField } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileExport, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import AdminPostsTable from '../../layouts/AdminLayout/components/AdminPostTable'

const posts = [
    { id: 6, user: 'Leanne Graham', title: 'dolorem eum magni eos aperiam quia' },
    { id: 32, user: 'Patricia Lebsack', title: 'doloremque illum aliquid sunt' },
    { id: 76, user: 'Nicholas Runolfsdottir V', title: 'doloremque officiis ad et non perferendis' },
    { id: 20, user: 'Ervin Howell', title: 'doloribus ad provident suscipit at' },
    { id: 6, user: 'Leanne Graham', title: 'dolorem eum magni eos aperiam quia' },
    { id: 32, user: 'Patricia Lebsack', title: 'doloremque illum aliquid sunt' },
    { id: 76, user: 'Nicholas Runolfsdottir V', title: 'doloremque officiis ad et non perferendis' },
    { id: 20, user: 'Ervin Howell', title: 'doloribus ad provident suscipit at' },
    { id: 6, user: 'Leanne Graham', title: 'dolorem eum magni eos aperiam quia' },
    { id: 32, user: 'Patricia Lebsack', title: 'doloremque illum aliquid sunt' },
    { id: 76, user: 'Nicholas Runolfsdottir V', title: 'doloremque officiis ad et non perferendis' },
    { id: 20, user: 'Ervin Howell', title: 'doloribus ad provident suscipit at' }
]

const PostsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredPosts = posts.filter(
        (post) =>
            post.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                    variant='outlined'
                    size='small'
                    placeholder='Search'
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
                        <FontAwesomeIcon icon={faFilter} style={{ marginRight: 5 }} /> Add Filter
                    </Button>
                    <Button variant='contained' sx={{ marginRight: 1 }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> Create
                    </Button>
                    <Button variant='contained' color='secondary'>
                        <FontAwesomeIcon icon={faFileExport} style={{ marginRight: 5 }} /> Export
                    </Button>
                </Toolbar>
            </Box>

            <Box sx={{ flex: 1, overflowX: 'auto' }}>
                <AdminPostsTable posts={filteredPosts} />
            </Box>
        </Box>
    )
}

export default PostsPage
