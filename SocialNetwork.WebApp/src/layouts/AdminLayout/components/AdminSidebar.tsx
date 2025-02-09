import React from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton, Tooltip, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTachometerAlt, faFileAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import { text } from '@fortawesome/fontawesome-svg-core'

interface SidebarProps {
    isCollapsed: boolean
    toggleSidebar: () => void
    setCurrentTab: (tab: string) => void
}

const AdminSidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, setCurrentTab }) => {
    return (
        <Drawer
            variant='permanent'
            sx={{
                width: isCollapsed ? 70 : 250,
                flexShrink: 0,
                transition: 'width 0.3s',
                '& .MuiDrawer-paper': {
                    width: isCollapsed ? 70 : 250,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    transition: 'width 0.3s',
                    display: 'flex',
                    flexDirection: 'column' // Sắp xếp các phần tử theo chiều dọc
                }
            }}
        >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 1 }}>
                <IconButton onClick={toggleSidebar} sx={{ width: '100%' }}>
                    <FontAwesomeIcon icon={faBars} style={{ fontSize: '24px', marginRight: isCollapsed ? 0 : 10 }} />
                    {!isCollapsed && (
                        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                            TRANG QUẢN TRỊ
                        </Typography>
                    )}
                </IconButton>
            </Box>

            <List sx={{ flexGrow: 1 }}>
                <Tooltip title='Dashboard' placement='right' disableHoverListener={!isCollapsed}>
                    <ListItem button onClick={() => setCurrentTab('dashboard')}>
                        <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', minWidth: '48px' }}>
                            <FontAwesomeIcon icon={faTachometerAlt} style={{ fontSize: '24px' }} />
                        </ListItemIcon>
                        {!isCollapsed && <ListItemText primary='Bảng thống kê' />}
                    </ListItem>
                </Tooltip>

                <Tooltip title='Posts' placement='right' disableHoverListener={!isCollapsed}>
                    <ListItem button onClick={() => setCurrentTab('posts')}>
                        <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', minWidth: '48px' }}>
                            <FontAwesomeIcon icon={faFileAlt} style={{ fontSize: '24px' }} />
                        </ListItemIcon>
                        {!isCollapsed && <ListItemText primary='Danh sách bài viết' />}
                    </ListItem>
                </Tooltip>

                <Tooltip title='Users' placement='right' disableHoverListener={!isCollapsed}>
                    <ListItem button onClick={() => setCurrentTab('users')}>
                        <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', minWidth: '48px' }}>
                            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '24px' }} />
                        </ListItemIcon>
                        {!isCollapsed && <ListItemText primary='Danh sách người sử dụng' />}
                    </ListItem>
                </Tooltip>
            </List>
        </Drawer>
    )
}

export default AdminSidebar
