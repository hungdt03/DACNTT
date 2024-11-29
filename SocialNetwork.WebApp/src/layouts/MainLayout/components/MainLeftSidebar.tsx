import { FC } from "react";
import images from "../../../assets";
import { Divider } from "antd";

const MainLeftSidebar: FC = () => {
    return <div className="col-span-3 hidden xl:block overflow-y-auto py-6 scrollbar-hide">
        <div className="bg-white flex flex-col shadow rounded-md">
            <div className="flex flex-col gap-y-3 items-center">
                <div className="w-full flex flex-col items-center">
                    <img alt="Ảnh bìa" className="w-full h-[100px] object-cover" src={images.cover} />
                    <img alt="Avatar" className="h-[50px] -mt-[25px]" src={images.user} />
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-[17px]">Lý Đại Cương</span>
                    <p className="text-gray-400 text-sm">Lập trình viên Fullstack</p>
                </div>
            </div>
            <div className="p-4 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold">256</span>
                        <span className="text-xs text-gray-400">số bài viết</span>
                    </div>
                    <Divider className="h-10 text-gray-500" type="vertical" />
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold">123</span>
                        <span className="text-xs text-gray-400">người theo dõi</span>
                    </div>
                    <Divider className="h-10 text-gray-500" type="vertical" />
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold">532</span>
                        <span className="text-xs text-gray-400">đang theo dõi</span>
                    </div>
                </div>
            </div>
            <Divider className="my-0" />
            <div className="p-4 flex flex-col gap-y-1">
                <div className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img className="w-8 h-8" src={images.feed} />
                    <span className="text-[15px] font-semibold text-gray-500">Bảng tin</span>
                </div>
                <div className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img className="w-8 h-8" src={images.friend} />
                    <span className="text-[15px] font-semibold text-gray-500">Bạn bè</span>
                </div>
                <div className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img className="w-8 h-8" src={images.group} />
                    <span className="text-[15px] font-semibold text-gray-500">Nhóm</span>
                </div>
                <div className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img className="w-8 h-8" src={images.settings} />
                    <span className="text-[15px] font-semibold text-gray-500">Cài đặt</span>
                </div>
            </div>
        </div>
    </div>
};

export default MainLeftSidebar;
