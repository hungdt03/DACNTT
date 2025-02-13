import React from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton, Tooltip, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTachometerAlt, faFileAlt, faUsers, faObjectGroup } from '@fortawesome/free-solid-svg-icons'

interface SidebarProps {
    isCollapsed: boolean
    toggleSidebar: () => void
    currentTab: string
    setCurrentTab: (tab: string) => void
}

const AdminSidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, currentTab, setCurrentTab }) => {
    const menuItems = [
        { label: 'Bảng thống kê', icon: faTachometerAlt },
        { label: 'Quản lý bài viết', icon: faFileAlt },
        { label: 'Quản lý tài khoản', icon: faUsers },
        { label: 'Quản lý nhóm', icon: faObjectGroup },
        { label: 'Quản lý báo cáo', icon: faFileAlt }
    ]

    return (
        <Drawer
            variant='permanent'
            sx={{
                width: isCollapsed ? 80 : 250,
                flexShrink: 0,
                transition: 'width 0.3s',
                '& .MuiDrawer-paper': {
                    width: isCollapsed ? 80 : 250,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    transition: 'width 0.3s',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    p: 1,
                    backgroundColor: 'primary.main',
                    height: '80px'
                }}
            >
                <IconButton onClick={toggleSidebar} sx={{ width: '100%' }}>
                    <FontAwesomeIcon
                        icon={faBars}
                        style={{ color: 'white', fontSize: '24px', marginRight: isCollapsed ? 0 : 10 }}
                    />
                    {!isCollapsed && (
                        <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'white' }}>
                            TRANG QUẢN TRỊ
                        </Typography>
                    )}
                </IconButton>
            </Box>

            <List sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <Tooltip key={item.label} title={item.label} placement='right' disableHoverListener={!isCollapsed}>
                        <ListItem
                            onClick={() => setCurrentTab(item.label)}
                            sx={{
                                backgroundColor: currentTab === item.label ? 'primary.dark' : 'transparent',
                                color: currentTab === item.label ? 'white' : 'inherit',
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: currentTab === item.label ? 'primary.dark' : 'primary.light',
                                    color: 'white'
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    minWidth: '48px',
                                    color: currentTab === item.label ? 'white' : 'inherit'
                                }}
                            >
                                <FontAwesomeIcon icon={item.icon} style={{ fontSize: '24px' }} />
                            </ListItemIcon>
                            {!isCollapsed && <ListItemText primary={item.label} />}
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Drawer>
    )
}

export default AdminSidebar
