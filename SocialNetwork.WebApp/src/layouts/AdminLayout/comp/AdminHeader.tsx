import { Popover } from "antd";
import { ChevronDown } from "lucide-react";
import { FC } from "react";
import AdminAccountDialog from "./AdminAccountDialog";
import images from "../../../assets";
import AdminNavbar from "./AdminNavbar";


const AdminHeader: FC = () => {
   
    return <div className="sticky top-0 flex z-50 items-center justify-end h-[80px] bg-white shadow px-10">
        <AdminNavbar />
    </div>
};

export default AdminHeader;
