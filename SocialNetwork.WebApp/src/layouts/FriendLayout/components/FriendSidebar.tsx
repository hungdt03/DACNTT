import { FC } from "react";
import { Link } from "react-router-dom";

const FriendSidebar: FC = () => {
    return <div className="col-span-3 flex flex-col gap-y-1 bg-white shadow border-r-[1px] h-full px-2 py-6 overflow-y-auto custom-scrollbar">
        <Link to='/friends/requests' className="hover:text-black font-bold px-2 py-2 rounded-md hover:bg-gray-100">Lời mời kết bạn</Link>
        <Link to='/friends/suggests' className="hover:text-black font-bold px-2 py-2 rounded-md hover:bg-gray-100">Gợi ý kết bạn</Link>
    </div>
};

export default FriendSidebar;
