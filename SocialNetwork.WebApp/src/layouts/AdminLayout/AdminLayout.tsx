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
import useTitle from '../../hooks/useTitle'

const AdminLayout: FC = () => {
    useTitle('Trang quản trị')
    const [currentTab, setCurrentTab] = useState('Bảng thống kê')
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <Flex style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
            <Layout style={{ height: '100vh', width: '100%', position: 'relative' }}>
                <AdminSidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    setCurrentTab={setCurrentTab}
                    currentTab={currentTab}
                />
                <AdminHeader title={currentTab} isSidebarCollapsed={isSidebarCollapsed} />
                <Box
                    sx={{
                        flex: 1,
                        marginLeft: isSidebarCollapsed ? '80px' : '250px',
                        marginTop: '80px',
                        transition: 'margin 0.3s',
                        height: 'calc(100vh - 80px)',
                        overflow: 'hidden',
                        p: 2
                    }}
                >
                    <Container
                        maxWidth={false}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&.MuiContainer-root': {
                                maxWidth: '100%',
                                px: 3
                            }
                        }}
                    >
                        {currentTab === 'Quản lý bài viết' && <PostsPage />}
                        {currentTab === 'Quản lý tài khoản' && <UsersPage />}
                        {currentTab === 'Quản lý báo cáo' && <ReportsPage />}
                        {currentTab === 'Quản lý nhóm' && <GroupsPage />}
                        {currentTab === 'Bảng thống kê' && <StatisticsPage />}
                    </Container>
                </Box>
            </Layout>
        </Flex>
    )
}

export default AdminLayout
