import { FC, useEffect } from "react";
import HeaderFullWidth from "../shared/HeaderFullWidth";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import GroupManagerSidebar from "./components/GroupManagerSidebar";

const GroupManagerLayout: FC = () => {
    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        if(location.pathname === '/groups/' || location.pathname === '/groups') {
            navigate('/groups/feeds')
        }
    }, [location.pathname])
    return <div className="flex flex-col w-full h-screen">
        <HeaderFullWidth />
        <div className="grid grid-cols-12 gap-4 h-full overflow-hidden">
            <GroupManagerSidebar />
            <div className="col-span-9 bg-slate-100 h-full overflow-hidden">
                <Outlet />
            </div>
        </div>
    </div>
};

export default GroupManagerLayout;
