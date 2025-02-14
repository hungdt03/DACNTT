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
import { GroupResource } from '../../../types/group'

type GroupsTableProps = {
    groups: GroupResource[]
    onGroupSelect: (selectedPosts: string[]) => void
    rowsPerPage: number
    page: number
    fetchGroups: () => void
}

type Order = 'asc' | 'desc'

const AdminGroupsTable: React.FC<GroupsTableProps> = ({ groups, onGroupSelect, rowsPerPage, page, fetchGroups }) => {
    const [selected, setSelected] = useState<string[]>([])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof GroupResource>('name')
    const [expanded, setExpanded] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    const handleConfirmDelete = (id: string) => {
        handleDeleteClick(id)
        setOpen(false)
    }
    const handleRequestSort = (property: keyof GroupResource) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelected = event.target.checked ? groups.map((group) => group.id) : []
        setSelected(newSelected)
        onGroupSelect(newSelected)
    }

    const handleClick = (id: string) => {
        const newSelected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
        setSelected(newSelected)
        onGroupSelect(newSelected)
    }

    const handleExpandClick = (id: string) => {
        setExpanded(expanded === id ? null : id)
    }
    const handleDeleteClick = async (id: string) => {
        const response = await adminService.DeleteOneGroup(id)
        if (response.isSuccess) {
            toast.success('Xóa bài viết thành công')
            fetchGroups()
        }
    }

    const sortedGroups = [...groups].sort((a, b) => {
        const aValue = a[orderBy]
        const bValue = b[orderBy]

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedGroups = sortedGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const columns = [
        { key: 'name', label: 'Tên nhóm' },
        { key: 'description', label: 'Mô tả nhóm' },
        { key: 'dateCreated', label: 'Ngày tạo' },
        { key: 'countMembers', label: 'Số thành viên' },
        { key: 'privacy', label: 'Chế độ nhóm' }
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
                                    indeterminate={selected.length > 0 && selected.length < groups.length}
                                    checked={groups.length > 0 && selected.length === groups.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>

                            {columns.map((column) => (
                                <TableCell key={column.key} sortDirection={orderBy === column.key ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === column.key}
                                        direction={orderBy === column.key ? order : 'asc'}
                                        onClick={() => handleRequestSort(column.key as keyof GroupResource)}
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
                        {groups.length > 0 &&
                            paginatedGroups.map((group, index) => (
                                <React.Fragment key={group.id}>
                                    <TableRow sx={{ height: 50 }}>
                                        <TableCell>
                                            <IconButton size='small' onClick={() => handleExpandClick(group.id)}>
                                                <FontAwesomeIcon icon={expanded === group.id ? faMinus : faPlus} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell padding='checkbox'>
                                            <Checkbox
                                                checked={selected.includes(group.id)}
                                                onClick={() => handleClick(group.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{group.name}</TableCell>
                                        <TableCell>{group.description}</TableCell>
                                        <TableCell>
                                            {group.dateCreated ? dayjs(group.dateCreated).format('DD/MM/YYYY') : '-'}
                                        </TableCell>
                                        <TableCell>{group.countMembers}</TableCell>
                                        <TableCell>
                                            {group.privacy === 'PUBLIC'
                                                ? 'Công khai'
                                                : group.privacy === 'PRIVATE'
                                                  ? 'Riêng tư'
                                                  : 'Khác'}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <span style={{ width: 10, display: 'contents' }}></span>
                                            <Popconfirm
                                                onConfirm={() => handleConfirmDelete(group.id)}
                                                title='Xác nhận xóa'
                                                description='Bạn có chắc chắn muốn xóa nhóm này?'
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
                                            <Collapse in={expanded === group.id} timeout='auto' unmountOnExit>
                                                <Typography
                                                    variant='subtitle2'
                                                    sx={{
                                                        paddingBottom: '1px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold',
                                                        paddingTop: 1
                                                    }}
                                                >
                                                    Chi tiết nhóm: {group.name}
                                                </Typography>
                                                <Grid container spacing={1} sx={{ fontSize: '0.85rem' }}>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số bài viết trong nhóm hôm nay: ${group.countTodayPosts}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} sx={{ padding: '2px' }}>
                                                        <Typography variant='body2'>{`Tổng số thành viên: ${group.countMembers}`}</Typography>
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

export default AdminGroupsTable
