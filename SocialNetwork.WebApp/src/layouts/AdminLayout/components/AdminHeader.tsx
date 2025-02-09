import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material'

interface HeaderProps {
    title: string
}

const AdminHeader: React.FC<HeaderProps> = ({ title }) => {
    return (
        <AppBar position='fixed' color='primary' sx={{ boxShadow: 1, height: '80px' }}>
            <Toolbar sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
                    {title.toUpperCase()}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default AdminHeader
