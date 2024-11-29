import { Avatar, Popover } from "antd";
import { FC, useState } from "react";
import images from "../assets";
import { Check, Delete, MoreHorizontal } from "lucide-react";

const NotificationMoreAction: FC = () => {
    return <div className="flex flex-col items-start rounded-md">
        <button className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Check size={17} className="text-gray-500" />
            Đánh dấu là đã đọc
        </button>
        <button className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Delete size={17} className="text-gray-500" />
            Xóa thông báo
        </button>
    </div>
}

const Notification: FC = () => {
    const [showMoreAction, setShowMoreAction] = useState(false);

    return <div onMouseOver={() => setShowMoreAction(true)} onMouseLeave={() => setShowMoreAction(false)} className="relative flex items-center gap-x-3 px-3 py-2 rounded-md hover:bg-gray-100 max-w-[400px]">
        <Avatar className="flex-shrink-0" size='large' src={images.user} />
        <div className="flex flex-col items-start">
            <div className="flex-1 line-clamp-2">
                <strong>Lí Đại Cương</strong> đã gửi lời mời kết bạn cho bạn đã gửi lời mời kết bạn cho bạn đã gửi lời mời kết bạn cho bạn đã gửi lời mời kết bạn cho bạn đã gửi lời mời kết bạn cho bạn
            </div>
            <span className="text-primary text-sm font-semibold px-1">2 ngày trước</span>
        </div>

        {showMoreAction && <Popover trigger='click' content={<NotificationMoreAction />}>
            <button className="absolute top-1/2 -translate-y-1/2 right-4 bg-white shadow transition-all ease-linear duration-100 border-[1px] border-gray-200 w-8 h-8 flex items-center justify-center rounded-full">
                <MoreHorizontal />
            </button>
        </Popover>}
    </div>
};

export default Notification;
