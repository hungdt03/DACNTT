import { Box, Container } from '@mui/material'
import PostsPage from '../../pages/admin/PostsPage'
import UsersPage from '../../pages/admin/UsersPage'
import AdminHeader from './components/AdminHeader'
import AdminSidebar from './components/AdminSidebar'
import { useState } from 'react'
import { Card } from 'antd'

const AdminLayout = () => {
    const [currentTab, setCurrentTab] = useState('doashboard')
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <Card>
            {/* Sidebar */}
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
                setCurrentTab={setCurrentTab}
            />

            {/* Layout chính */}
            <Box sx={{ flexGrow: 1, marginLeft: isSidebarCollapsed ? '70px' : '250px', transition: 'margin 0.3s' }}>
                <AdminHeader title={currentTab} />

                <Box sx={{ flex: 1, padding: 2, marginTop: '64px', overflowY: 'auto' }}>
                    <Container>
                        {currentTab === 'posts' && <PostsPage />}
                        {currentTab === 'users' && <UsersPage />}
                        {currentTab === 'dashboard' && <h2>Dashboard</h2>}
                    </Container>
                </Box>
            </Box>
        </Card>
    )
}

export default AdminLayout
