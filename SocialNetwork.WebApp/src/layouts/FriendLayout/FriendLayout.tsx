import { FC } from "react";
import HeaderFullWidth from "../shared/HeaderFullWidth";
import FriendSidebar from "./components/FriendSidebar";
import { Outlet } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const FriendLayout: FC = () => {
    useTitle('Kết bạn')
    return <div className="w-screen h-screen bg-slate-100 overflow-y-hidden flex flex-col">
        <HeaderFullWidth />
        <div className="grid grid-cols-12 gap-6 lg:h-full w-full overflow-hidden">
            <FriendSidebar />
            <div className="col-span-12 lg:col-span-9 h-full overflow-hidden">
                <Outlet />
            </div>
        </div>
    </div>
};

export default FriendLayout;
