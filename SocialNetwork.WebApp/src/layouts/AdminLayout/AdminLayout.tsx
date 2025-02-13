import { Box, Container } from '@mui/material'
import PostsPage from '../../pages/admin/PostsPage'
import UsersPage from '../../pages/admin/UsersPage'
import AdminHeader from './components/AdminHeader'
import AdminSidebar from './components/AdminSidebar'
import { FC, useState } from 'react'
import GroupsPage from '../../pages/admin/GroupsPage'
import ReportsPage from '../../pages/admin/ReportsPage'
import StatisticsPage from '../../pages/admin/StatisticsPage'
import { Flex, Layout } from 'antd'

const AdminLayout: FC = () => {
    const [currentTab, setCurrentTab] = useState('Bảng thống kê')
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <Flex style={{ minHeight: '100vh', width: '100%' }}>
            <Layout style={{ minHeight: '100vh', width: '100%' }}>
                <AdminSidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    setCurrentTab={setCurrentTab}
                    currentTab={currentTab}
                />
                <AdminHeader title={currentTab} />
                <Box
                    sx={{
                        flexGrow: 1,
                        marginLeft: isSidebarCollapsed ? '0px' : '200px',
                        transition: 'margin 0.3s',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            padding: 2,
                            marginTop: '100px',
                            height: '100%',
                            width: '100%',
                            flexDirection: 'column'
                        }}
                    >
                        <Container sx={{ flex: 1, width: '100%' }}>
                            {currentTab === 'Quản lý bài viết' && <PostsPage />}
                            {currentTab === 'Quản lý tài khoản' && <UsersPage />}
                            {currentTab === 'Quản lý báo cáo' && <ReportsPage />}
                            {currentTab === 'Quản lý nhóm' && <GroupsPage />}
                            {currentTab === 'Bảng thống kê' && <StatisticsPage />}
                        </Container>
                    </Box>
                </Box>
            </Layout>
        </Flex>
    )
}

export default AdminLayout
