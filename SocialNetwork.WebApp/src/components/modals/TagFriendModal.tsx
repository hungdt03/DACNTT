import { Avatar } from "antd";
import { Search } from "lucide-react";
import { FC } from "react";
import images from "../../assets";

const TagFriendModal: FC = () => {
    return <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-4">
            <div className="flex flex-1 items-center gap-x-2 px-3 py-2 rounded-3xl bg-gray-100">
                <Search size={16} />
                <input className="outline-none border-none bg-gray-100 w-full" placeholder="Tìm kiếm" />
            </div>
            <button className="text-primary font-semibold">Xong</button>
        </div>
        <div className="flex flex-col gap-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
            <span className="font-semibold text-gray-500 px-1">GỢI Ý</span>
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
                <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={images.user} />
                    <span>Nguyễn Trọng Đức</span>
                </div>
            </div>
        </div>
    </div>
};

export default TagFriendModal;
