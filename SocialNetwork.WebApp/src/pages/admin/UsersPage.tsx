import React, { useState } from 'react'
import { Toolbar, Button, InputAdornment, TextField, Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileExport, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import AdminUsersTable from '../../layouts/AdminLayout/components/AdminUserTable'

const users = [
    { id: 1, name: 'Leanne Graham', email: 'leanne@example.com' },
    { id: 2, name: 'Ervin Howell', email: 'ervin@example.com' },
    { id: 3, name: 'Clementine Bauch', email: 'clementine@example.com' },
    { id: 4, name: 'Patricia Lebsack', email: 'patricia@example.com' },
    { id: 1, name: 'Leanne Graham', email: 'leanne@example.com' },
    { id: 2, name: 'Ervin Howell', email: 'ervin@example.com' },
    { id: 3, name: 'Clementine Bauch', email: 'clementine@example.com' },
    { id: 4, name: 'Patricia Lebsack', email: 'patricia@example.com' },
    { id: 1, name: 'Leanne Graham', email: 'leanne@example.com' },
    { id: 2, name: 'Ervin Howell', email: 'ervin@example.com' },
    { id: 3, name: 'Clementine Bauch', email: 'clementine@example.com' },
    { id: 4, name: 'Patricia Lebsack', email: 'patricia@example.com' }
]

const UsersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
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

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <AdminUsersTable users={filteredUsers} />
            </Box>
        </Box>
    )
}

export default UsersPage
