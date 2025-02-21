import { FC, useEffect, useState } from "react";
import { ChatRoomResource } from "../../types/chatRoom";
import chatRoomService from "../../services/chatRoomService";
import { Avatar, Empty } from "antd";
import { formatTime } from "../../utils/date";
import messageService from "../../services/messageService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { add, setChatRoomRead } from "../../features/slices/chat-popup-slice";
import cn from "../../utils/cn";
import images from "../../assets";

type PendingChatTabProps = {
    width?: 'dialog' | 'sidebar'
}

const PendingChatTab: FC<PendingChatTabProps> = ({
    width = 'dialog'
}) => {
    const [pendingChats, setPendingChats] = useState<ChatRoomResource[]>([]);
    const dispatch = useDispatch<AppDispatch>()

    const fetchPendingChatRooms = async () => {
        const response = await chatRoomService.getAllPendingChatRooms();
        if (response.isSuccess) {
            setPendingChats(response.data)
        }
    }


    const readMessage = async (chatRoom: ChatRoomResource) => {
        await messageService.readMessage(chatRoom.id);
        dispatch(add(chatRoom));
        dispatch(setChatRoomRead(chatRoom.id));
    }

    const handleSelectChat = async (chatRoom: ChatRoomResource) => {
        await readMessage(chatRoom)
        setPendingChats(prev => [...prev.filter(c => c.id !== chatRoom.id)])
    }


    useEffect(() => {
        fetchPendingChatRooms()
    }, [])

    return <div className={cn("flex flex-col gap-y-3", width === 'dialog' ? 'w-[380px]' : 'w-full')}>
        <span className="font-bold text-gray-700 px-1 text-[15px]">Tin nhắn chờ</span>
        {pendingChats.map(chatRoom => <div onClick={() => handleSelectChat(chatRoom)} key={chatRoom.id} className="relative flex items-center gap-x-3 py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <div className="relative">
                <Avatar className="w-12 flex-shrink-0 h-12 object-cover" src={chatRoom.friend?.avatar ?? images.group} />
                {chatRoom.isOnline && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>}
            </div>
            <div className="flex flex-col items-start gap-y-1">
                <span className="font-semibold text-[16px] text-sm">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                <div className="flex items-center gap-x-3">
                    <p
                        className={cn("text-[12px] max-w-[120px] truncate overflow-hidden text-ellipsis whitespace-nowrap", !chatRoom.isRead ? 'text-black font-bold' : 'text-gray-500 font-normal')}>
                        {chatRoom.lastMessage}
                    </p>
                    <span className="text-xs text-gray-400">{formatTime(new Date(chatRoom.lastMessageDate))}</span>
                </div>
            </div>

            {!chatRoom.isRead && <div className="bg-primary w-2 h-2 rounded-full absolute top-1/2 -translate-y-1/2 right-2"></div>}
        </div>)}

        {pendingChats.length === 0 && <Empty description='Không có tin nhắn chờ nào' />}
    </div>
};

export default PendingChatTab;
