import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import CustomTablePagination from './TablePagination'
import { GroupResource } from '../../../types/group'

type GroupTableProps = {
    groups: GroupResource[]
}

const AdminGroupsTable: React.FC<GroupTableProps> = ({ groups }) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const paginatedGroups = groups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
                                <b>Tên nhóm </b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 150 }}>
                                <b>Mô tả</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 100 }}>
                                <b>Ngày tạo</b>
                            </TableCell>
                            <TableCell sx={{ flexGrow: 1, minWidth: 120 }}>
                                <b>Số lượng thành viên</b>
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
                        {paginatedGroups.map((group, index) => (
                            <TableRow key={group.id} sx={{ height: 50 }}>
                                <TableCell sx={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{group.name}</TableCell>
                                <TableCell>{group.description}</TableCell>
                                <TableCell>
                                    {group.dateCreated ? dayjs(group.dateCreated).format('DD/MM/YYYY') : '-'}
                                </TableCell>
                                <TableCell>{group.countMembers}</TableCell>
                                <TableCell>
                                    {group.privacy === null
                                        ? 'Khác'
                                        : group.privacy === 'PUBLIC'
                                          ? 'Công khai'
                                          : group.privacy === 'PRIVATE'
                                            ? 'Riêng tư'
                                            : 'Khác'}
                                </TableCell>
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
                count={groups.length}
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

export default AdminGroupsTable
