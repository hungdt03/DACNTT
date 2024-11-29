import { Avatar } from "antd";
import { FC } from "react";
import images from "../../../assets";
import { Plus } from "lucide-react";
import ChatPopup from "../../../components/chats/ChatPopup";

const MainRightSidebar: FC = () => {
    return <div className="xl:col-span-3 lg:col-span-4 hidden lg:flex flex-col gap-y-6 overflow-y-auto py-6 scrollbar-hide">
        <div className="p-4 rounded-md shadow bg-white flex flex-col gap-y-4">
            <span className="font-semibold text-lg text-gray-700">Gợi ý kết bạn</span>
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <Avatar size='large' src={images.user} />
                        <div className="flex flex-col gap-y-1">
                            <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                            <span className="text-gray-500 text-sm">13 bạn chung</span>
                        </div>
                    </div>

                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-100">
                        <Plus size={16} className="text-sky-500" />
                    </button>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <Avatar size='large' src={images.user} />
                        <div className="flex flex-col gap-y-1">
                            <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                            <span className="text-gray-500 text-sm">13 bạn chung</span>
                        </div>
                    </div>

                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-100">
                        <Plus size={16} className="text-sky-500" />
                    </button>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <Avatar size='large' src={images.user} />
                        <div className="flex flex-col gap-y-1">
                            <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                            <span className="text-gray-500 text-sm">13 bạn chung</span>
                        </div>
                    </div>

                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-100">
                        <Plus size={16} className="text-sky-500" />
                    </button>
                </div>
            </div>
            <button className="bg-sky-100 text-sky-500 py-[6px] rounded-md text-sm">Xem thêm</button>
        </div>
        <div className="p-4 rounded-md shadow bg-white flex flex-col gap-y-4">
            <span className="font-semibold text-lg text-gray-700">Người liên hệ</span>
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <Avatar size='large' src={images.user} />
                            <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                        </div>
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <Avatar size='large' src={images.user} />
                            <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                        </div>
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <Avatar size='large' src={images.user} />
                            <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                        </div>
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <Avatar size='large' src={images.user} />
                            <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                        </div>
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <Avatar size='large' src={images.user} />
                            <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                        </div>
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <Avatar size='large' src={images.user} />
                            <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                        </div>
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <Avatar size='large' src={images.user} />
                            <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                        </div>
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>
                </div>
            </div>
            <button className="bg-sky-100 text-sky-500 py-[6px] rounded-md text-sm">Xem thêm</button>
        </div>

        {/* <div className="absolute right-24 bottom-0 flex gap-x-4">
            <ChatPopup />
            <ChatPopup />
            <ChatPopup />
            <ChatPopup />
        </div> */}
    </div>
};

export default MainRightSidebar;
