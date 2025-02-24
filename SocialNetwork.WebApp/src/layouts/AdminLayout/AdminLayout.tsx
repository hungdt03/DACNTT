import { Outlet } from 'react-router-dom';
import AdminHeader from './comp/AdminHeader';
import AdminSidebar from './comp/AdminSidebar'
import { FC, useState } from 'react';

const AdminLayout: FC = () => {

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className='w-screen h-screen flex overflow-y-hidden'>
            <AdminSidebar collapsed={collapsed} />
            <div className='flex-1 h-full w-full flex flex-col overflow-hidden'>
                <AdminHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                <div className='p-4 bg-slate-50 h-full w-full overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout
