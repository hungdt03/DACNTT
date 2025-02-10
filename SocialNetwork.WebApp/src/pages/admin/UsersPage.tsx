import React, { useEffect, useState, useMemo } from 'react'
import { Toolbar, Button, InputAdornment, TextField, Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileExport, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import AdminUsersTable from '../../layouts/AdminLayout/components/AdminUserTable'
import { UserResource } from '../../types/user'
import adminService from '../../services/adminService'

const UsersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [allUser, setAllUser] = useState<UserResource[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await adminService.getAllUser()
            if (response.isSuccess) {
                setAllUser(response.data)
            }
        }
        fetchUsers()
    }, [])
    const removeDiacritics = (str: string) => {
        return str
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
    }

    const filteredUsers = useMemo(() => {
        const normalizedSearchTerm = removeDiacritics(searchTerm)

        return allUser.filter((user) =>
            [user.fullName, user.email, user.phoneNumber].some((field) =>
                removeDiacritics(field || '').includes(normalizedSearchTerm)
            )
        )
    }, [searchTerm, allUser])

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
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> Thêm người dùng
                    </Button>
                    <Button variant='contained' color='secondary'>
                        <FontAwesomeIcon icon={faFileExport} style={{ marginRight: 5 }} /> Xuất file
                    </Button>
                </Toolbar>
            </Box>

            <Box sx={{ overflow: 'auto', height: '100%' }}>
                <AdminUsersTable users={filteredUsers} />
            </Box>
        </Box>
    )
}

export default UsersPage
