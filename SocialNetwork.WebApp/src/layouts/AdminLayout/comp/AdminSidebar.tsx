import {
    ContainerOutlined,
    PieChartOutlined,
    UserOutlined,
    GroupOutlined,
    AlertFilled,
    KeyOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { FC } from 'react';
import images from '../../../assets';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: <Link to='/admin'>Thống kê</Link> },
    { key: '2', icon: <ContainerOutlined />, label: <Link to='/admin/posts'>Bài viết</Link> },
    { key: '3', icon: <GroupOutlined />, label: <Link to='/admin/groups'>Nhóm</Link> },
    { key: '4', icon: <UserOutlined />, label: <Link to='/admin/users'>Người dùng</Link> },
    { key: '5', icon: <AlertFilled />, label: <Link to='/admin/reports'>Báo cáo</Link> },
    { key: '6', icon: <KeyOutlined />, label: <Link to='/admin/accounts'>Tài khoản quản trị</Link> },
];


type AdminSidebarProps = {
    collapsed: boolean;
}

const AdminSidebar: FC<AdminSidebarProps> = ({
    collapsed
}) => {
    return <div style={{
        width: collapsed ? 80 : 300
    }} className='h-full overflow-y-auto bg-white custom-scrollbar'>
        <div className='flex items-center gap-x-2 px-4 py-8'>
            <img className='w-10 h-10' src={images.facebook} />
           {!collapsed &&  <span className='text-sky-600 font-bold text-xl'>Trang quản trị</span>}
        </div>
        <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
        />
    </div>
};

export default AdminSidebar;
