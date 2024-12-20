import { Avatar } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Search } from "lucide-react";
import { ChatRoomResource } from "../../types/chatRoom";
import chatRoomService from "../../services/chatRoomService";
import { formatTime } from "../../utils/date";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { add } from "../../features/slices/chat-popup-slice";

const MessengerDialog: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const response = await chatRoomService.getAllChatRooms();
            if (response.isSuccess) {
                console.log(response)
                setChatRooms(response.data)
            }
        }

        fetchChatRooms()
    }, []);

    return <div className="flex flex-col gap-y-3 w-[330px]">
        <span className="font-semibold text-gray-500 px-1 text-lg">Đoạn chat</span>
        <div className="flex flex-1 items-center gap-x-2 px-3 py-2 rounded-3xl bg-gray-100">
            <Search size={16} />
            <input className="outline-none border-none bg-gray-100 w-full" placeholder="Tìm kiếm cuộc hội thoại" />
        </div>
        <div className="flex flex-col gap-y-2 p-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {chatRooms.map(chatRoom => <div onClick={() => dispatch(add(chatRoom))} key={chatRoom.id} className="flex items-center gap-x-3 py-2 px-3 hover:bg-gray-100 rounded-md">
                <div className="relative">
                    <Avatar className="w-12 flex-shrink-0 h-12 object-cover" src={chatRoom.friend?.avatar ?? images.friend} />
                    <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                </div>
                <div className="flex flex-col items-start gap-y-1">
                    <span className="font-semibold text-[16px] text-sm">{chatRoom.friend?.fullName}</span>
                    <div className="flex items-center gap-x-3">
                        <p
                            className="text-[14px] text-gray-500 max-w-[120px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                            {chatRoom.lastMessage}
                        </p>
                        <span className="text-xs text-gray-400">{formatTime(new Date(chatRoom.lastMessageDate))}</span>
                    </div>
                </div>
            </div>)}

        </div>
    </div>
};

export default MessengerDialog;
