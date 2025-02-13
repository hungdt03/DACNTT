import React from 'react'
import { TablePagination } from '@mui/material'

type PaginationProps = {
    count: number
    page: number
    rowsPerPage: number
    onPageChange: (event: unknown, newPage: number) => void
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

const CustomTablePagination: React.FC<PaginationProps> = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange
}) => {
    return (
        <TablePagination
            component='div'
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            rowsPerPageOptions={[5, 10, 20, 50]}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage='Số dòng mỗi trang'
            sx={{
                display: 'flex-end',
                bottom: 0,
                backgroundColor: 'white'
            }}
        />
    )
}

export default CustomTablePagination
