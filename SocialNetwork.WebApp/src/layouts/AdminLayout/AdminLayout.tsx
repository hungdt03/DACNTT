import { Outlet } from 'react-router-dom';
import AdminHeader from './comp/AdminHeader';
import AdminSidebar from './comp/AdminSidebar'
import { FC } from 'react';

// const AdminLayout: FC = () => {
//     useTitle('Trang quản trị')
//     const [currentTab, setCurrentTab] = useState('Bảng thống kê')
//     const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

//     return (
//         <Flex style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
//             <Layout style={{ height: '100vh', width: '100%', position: 'relative' }}>
//                 <AdminSidebar
//                     isCollapsed={isSidebarCollapsed}
//                     toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
//                     setCurrentTab={setCurrentTab}
//                     currentTab={currentTab}
//                 />
//                 <AdminHeader title={currentTab} isSidebarCollapsed={isSidebarCollapsed} />
//                 <Box
//                     sx={{
//                         flex: 1,
//                         marginLeft: isSidebarCollapsed ? '80px' : '250px',
//                         marginTop: '80px',
//                         transition: 'margin 0.3s',
//                         height: 'calc(100vh - 80px)',
//                         overflow: 'hidden',
//                         p: 2
//                     }}
//                 >
//                     <Container
//                         maxWidth={false}
//                         sx={{
//                             height: '100%',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             '&.MuiContainer-root': {
//                                 maxWidth: '100%',
//                                 px: 3
//                             }
//                         }}
//                     >
//                         {currentTab === 'Quản lý bài viết' && <PostsPage />}
//                         {currentTab === 'Quản lý tài khoản' && <UsersPage />}
//                         {currentTab === 'Quản lý báo cáo' && <ReportsPage />}
//                         {currentTab === 'Quản lý nhóm' && <GroupsPage />}
//                         {currentTab === 'Bảng thống kê' && <StatisticsPage />}
//                     </Container>
//                 </Box>
//             </Layout>
//         </Flex>
//     )
// }



const AdminLayout: FC = () => {
    return (
        <div className='w-screen h-screen grid grid-cols-12 overflow-y-hidden'>
            <AdminSidebar />
            <div className='col-span-9 h-full w-full flex flex-col overflow-hidden'>
                <AdminHeader />
                <div className='p-4 bg-slate-50 h-full w-full overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout
