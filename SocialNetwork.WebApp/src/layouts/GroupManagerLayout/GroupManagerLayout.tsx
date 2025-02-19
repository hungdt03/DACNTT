import { FC, useEffect, useState } from "react";
import HeaderFullWidth from "../shared/HeaderFullWidth";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import GroupManagerSidebar from "./components/GroupManagerSidebar";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import { Drawer } from "antd";
import useTitle from "../../hooks/useTitle";

const GroupManagerLayout: FC = () => {
    useTitle('Quản lí nhóm')
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (location.pathname === '/groups/' || location.pathname === '/groups') {
            navigate('/groups/feeds')
        }
    }, [location.pathname])
    return <div className="flex flex-col w-full h-screen">
        <HeaderFullWidth />
        <div className="grid grid-cols-12 gap-4 h-full overflow-hidden">
            <div className="relative h-full lg:col-span-3 overflow-y-auto custom-scrollbar hidden lg:block p-4">
                <GroupManagerSidebar />
            </div>
            <div className="col-span-12 lg:col-span-9 bg-slate-100 h-full overflow-hidden">
                <div className="my-4 lg:hidden max-w-screen-sm mx-auto px-1 sm:px-0">
                    <div className="flex items-center justify-between bg-white shadow p-3 rounded-md">
                        <div className="flex items-center gap-x-2">
                            <Link to='/groups/feeds' className="hover:text-gray-600 text-gray-600 text-sm font-bold hover:bg-gray-100 px-2 py-[6px] rounded-md">Bảng tin</Link>
                            <Link to='/groups/feeds' className="hover:text-gray-600 text-gray-600 text-sm font-bold hover:bg-gray-100 px-2 py-[6px] rounded-md">Lời mời</Link>
                        </div>
                        <button onClick={() => setOpen(true)} className="hover:text-gray-600 text-gray-600 text-sm font-bold hover:bg-gray-100 p-2 rounded-full">
                            <Bars3BottomRightIcon className="text-gray-500" width={20} />
                        </button>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>

        <Drawer title='QUẢN LÍ NHÓM' open={open} onClose={() => setOpen(false)} className="lg:hidden">
            <GroupManagerSidebar />
        </Drawer>
    </div>
};

export default GroupManagerLayout;
