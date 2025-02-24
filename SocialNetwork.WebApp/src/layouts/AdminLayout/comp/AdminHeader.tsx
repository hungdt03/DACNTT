import { FC } from "react";
import AdminNavbar from "./AdminNavbar";
import { Button } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';

type AdminHeaderProps = {
    collapsed: boolean;
    toggleCollapsed: () => void
}

const AdminHeader: FC<AdminHeaderProps> = ({
    collapsed,
    toggleCollapsed
}) => {
    
    return <div className="sticky top-0 flex z-50 items-center justify-between h-[80px] bg-white shadow px-10">
        <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>

        <AdminNavbar />
    </div>
};

export default AdminHeader;
