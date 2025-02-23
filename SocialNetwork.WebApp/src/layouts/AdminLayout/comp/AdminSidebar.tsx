import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { FC, useState } from 'react';
import images from '../../../assets';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: <Link to='/admin'>Thống kê</Link> },
    { key: '2', icon: <DesktopOutlined />, label: <Link to='/admin/posts'>Bài viết</Link> },
    { key: '3', icon: <ContainerOutlined />, label: <Link to='/admin/groups'>Nhóm</Link> },
    { key: '4', icon: <ContainerOutlined />, label: <Link to='/admin/users'>Người dùng</Link> },
    { key: '5', icon: <ContainerOutlined />, label: <Link to='/admin/reports'>Báo cáo</Link> },
];

const AdminSidebar: FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    //     <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
    //     {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    // </Button>

    return <div className='col-span-3 h-full w-full overflow-y-auto bg-white custom-scrollbar'>
        <div className='flex items-center gap-x-2 px-4 py-8'>
            <img className='w-10 h-10' src={images.facebook} />
            <span className='text-sky-600 font-bold text-xl'>Trang quản trị</span>
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
