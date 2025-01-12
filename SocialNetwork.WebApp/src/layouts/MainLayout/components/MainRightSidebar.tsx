import { Avatar } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { Plus, X } from "lucide-react";
import { ChatRoomResource } from "../../../types/chatRoom";
import chatRoomService from "../../../services/chatRoomService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { add } from "../../../features/slices/chat-popup-slice";

const MainRightSidebar: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const response = await chatRoomService.getAllChatRooms();
            if (response.isSuccess) {
                setChatRooms(response.data)
            }
        }

        fetchChatRooms()
    }, []);

    return <div className="xl:col-span-3 lg:col-span-4 hidden lg:flex flex-col gap-y-6 overflow-y-auto py-6 scrollbar-hide">
        <div className="p-4 rounded-md shadow bg-white flex flex-col gap-y-4">
            <span className="font-semibold text-lg text-gray-700">Lời mời kết bạn</span>
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <Avatar size='default' src={images.user} />
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
                            <X size={16} className="text-gray-600" />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100">
                            <Plus size={16} className="text-sky-500" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <Avatar size='default' src={images.user} />
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
                            <X size={14} className="text-gray-600" />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100">
                            <Plus size={14} className="text-sky-500" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <Avatar size='default' src={images.user} />
                        <span className="font-semibold text-sm">Trần Phan Hoàn Việt</span>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
                            <X size={16} className="text-gray-600" />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100">
                            <Plus size={16} className="text-sky-500" />
                        </button>
                    </div>
                </div>
            </div>
            <button className="bg-sky-100 text-sky-500 py-[6px] rounded-md text-sm">Xem thêm</button>
        </div>
        <div className="p-4 rounded-md shadow bg-white flex flex-col gap-y-4">
            <span className="font-semibold text-lg text-gray-700">Người liên hệ</span>
            <div className="flex flex-col gap-y-2">
                {chatRooms.filter(chatRoom => chatRoom.isOnline).map(chatRoom => <div key={chatRoom.id} onClick={() => dispatch(add(chatRoom))} className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <Avatar size='large' src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} />
                            <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                        </div>
                        <span className="font-semibold text-sm">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                    </div>
                </div>)}


            </div>
            <button className="bg-sky-100 text-sky-500 py-[6px] rounded-md text-sm">Xem thêm</button>
        </div>

    </div>
};

export default MainRightSidebar;
