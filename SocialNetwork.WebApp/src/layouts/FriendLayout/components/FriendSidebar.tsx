import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import cn from "../../../utils/cn";
import { MoveLeft } from "lucide-react";

const FriendSidebar: FC = () => {
    const location = useLocation();

    return <div className="col-span-3 flex flex-col gap-y-1 bg-white shadow border-r-[1px] h-full px-2 py-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-x-3 mb-2">
            <Link to='/'><MoveLeft /></Link>
            <span className="text-xl font-bold">Kết bạn</span>
        </div>
        <Link to='/friends/requests' className={cn("hover:text-black font-semibold px-2 py-2 rounded-md hover:bg-gray-100", location.pathname.includes('/requests') && 'bg-gray-100')}>Lời mời kết bạn</Link>
        <Link to='/friends/suggests' className={cn("hover:text-black font-semibold px-2 py-2 rounded-md hover:bg-gray-100", location.pathname.includes('/suggests') && 'bg-gray-100')}>Gợi ý kết bạn</Link>
    </div>
};

export default FriendSidebar;
