import React, { useEffect, useState, useMemo } from 'react'
import { Toolbar, Button, InputAdornment, TextField, Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileExport, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import adminService from '../../services/adminService'
import { GroupResource } from '../../types/group'
import AdminGroupsTable from '../../layouts/AdminLayout/components/AdminGroupsTable'

const GroupsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [allGroup, setAllGroup] = useState<GroupResource[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await adminService.getAllGroup()
            if (response.isSuccess) {
                setAllGroup(response.data)
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

    const filteredGroup = useMemo(() => {
        const normalizedSearchTerm = removeDiacritics(searchTerm)

        return allGroup.filter((group) =>
            [group.name, group.description, group.id].some((field) =>
                removeDiacritics(field || '').includes(normalizedSearchTerm)
            )
        )
    }, [searchTerm, allGroup])

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
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> Thêm nhóm
                    </Button>
                    <Button variant='contained' color='secondary'>
                        <FontAwesomeIcon icon={faFileExport} style={{ marginRight: 5 }} /> Xuất file
                    </Button>
                </Toolbar>
            </Box>

            <Box sx={{ overflow: 'auto', height: '100%' }}>
                <AdminGroupsTable groups={filteredGroup} />
            </Box>
        </Box>
    )
}

export default GroupsPage
