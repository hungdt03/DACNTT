import { FC } from "react";
import HeaderFullWidth from "../shared/HeaderFullWidth";
import { Outlet } from "react-router-dom";
import GroupManagerSidebar from "./components/GroupManagerSidebar";

const GroupManagerLayout: FC = () => {
    return <div className="flex flex-col w-full h-screen">
        <HeaderFullWidth />
        <div className="grid grid-cols-12 gap-4 h-full overflow-hidden">
            <GroupManagerSidebar />
            <div className="col-span-9 bg-slate-100">
                <Outlet />
            </div>
        </div>
    </div>
};

export default GroupManagerLayout;
