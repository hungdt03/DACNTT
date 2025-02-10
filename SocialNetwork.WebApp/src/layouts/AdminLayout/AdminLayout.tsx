import { Box, Container } from '@mui/material'
import PostsPage from '../../pages/admin/PostsPage'
import UsersPage from '../../pages/admin/UsersPage'
import AdminHeader from './components/AdminHeader'
import AdminSidebar from './components/AdminSidebar'
import { FC, useState } from 'react'
import { Card } from 'antd'
import GroupsPage from '../../pages/admin/GroupsPage'

const AdminLayout: FC = () => {
    const [currentTab, setCurrentTab] = useState('Bảng thống kê')
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <Card style={{ overflow: 'hidden' }}>
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
                setCurrentTab={setCurrentTab}
                currentTab={currentTab}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: isSidebarCollapsed ? '70px' : '250px',
                    transition: 'margin 0.3s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                <AdminHeader title={currentTab} />

                <Box
                    sx={{
                        flex: 1,
                        padding: 2,
                        marginTop: '50px',
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Container sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
                        {currentTab === 'Quản lý bài viết' && <PostsPage />}
                        {currentTab === 'Quản lý người dùng' && <UsersPage />}
                        {currentTab === 'Quản lý báo cáo' && <h2>Quản lý báo cáo</h2>}
                        {currentTab === 'Quản lý nhóm' && <GroupsPage />}
                        {currentTab === 'Bảng thống kê' && <h2>Bảng thống kê</h2>}
                    </Container>
                </Box>
            </Box>
        </Card>
    )
}

export default AdminLayout
