import { FC } from "react";
import HeaderFullWidth from "../shared/HeaderFullWidth";
import FriendSidebar from "./components/FriendSidebar";
import { Outlet } from "react-router-dom";

const FriendLayout: FC = () => {
    return <div className="w-full h-screen bg-slate-100 overflow-hidden">
        <HeaderFullWidth />
        <div className="grid grid-cols-12 gap-6 h-full w-full">
            <FriendSidebar />
            <div className="col-span-9 h-full overflow-hidden">
                <Outlet />
            </div>
        </div>
    </div>
};

export default FriendLayout;
