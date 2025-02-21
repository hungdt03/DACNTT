import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import cn from "../../../utils/cn";
import { MoveLeft } from "lucide-react";

const FriendSidebar: FC = () => {
    const location = useLocation();

    return <div className="lg:col-span-3 col-span-12 flex flex-col gap-y-1 bg-white shadow border-r-[1px] lg:h-full px-2 py-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-x-3 mb-2">
            <Link to='/'><MoveLeft /></Link>
            <span className="text-lg md:text-xl font-bold">Kết bạn</span>
        </div>
        <div className="flex lg:flex-col gap-x-2 flex-row">
            <Link to='/friends/requests' className={cn("hover:text-black md:font-semibold py-2 font-medium px-2 md:py-3 rounded-md hover:bg-gray-100 text-sm md:text-[16px]", location.pathname.includes('/requests') && 'bg-gray-100')}>Lời mời kết bạn</Link>
            <Link to='/friends/suggests' className={cn("hover:text-black md:font-semibold py-2 font-medium px-2 md:py-3 rounded-md hover:bg-gray-100 text-sm md:text-[16px]", location.pathname.includes('/suggests') && 'bg-gray-100')}>Gợi ý kết bạn</Link>
        </div>
    </div>
};

export default FriendSidebar;
