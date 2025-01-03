import { FC, useEffect, useState } from "react";
import ChatArea from "../components/chats/ChatArea";
import ChatDetails from "../components/chats/ChatDetails";
import { ChatRoomResource } from "../types/chatRoom";
import { useParams } from "react-router-dom";
import chatRoomService from "../services/chatRoomService";
import ChatSidebar from "../layouts/ChatLayout/components/ChatSidebar";

const ChatPage: FC = () => {
    const { id } = useParams()
    const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoomResource | null>(null);

    const fetchChatRoom = async () => {
        if (id) {
            const response = await chatRoomService.getChatRoomById(id);
            if (response.isSuccess) {
                setCurrentChatRoom(response.data)
            }
        }
    }

    useEffect(() => {
        fetchChatRoom();
    }, [id])

    return <div className="grid grid-cols-12 h-screen">
        <ChatSidebar />
        <div className="col-span-9 overflow-hidden">
            <div className="grid grid-cols-12 h-full overflow-hidden">
                {currentChatRoom && <ChatArea chatRoom={currentChatRoom} />}
                <div className="col-span-4">
                    <ChatDetails />
                </div>
            </div>
        </div>
    </div>



};

export default ChatPage;
