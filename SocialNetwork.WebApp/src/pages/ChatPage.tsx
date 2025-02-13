import { FC, useEffect, useState } from "react";
import ChatArea from "../components/chats/ChatArea";
import ChatDetails from "../components/chats/ChatDetails";
import { ChatRoomResource } from "../types/chatRoom";
import { useParams } from "react-router-dom";
import chatRoomService from "../services/chatRoomService";
import ChatSidebar from "../components/chats/ChatSidebar";
import cn from "../utils/cn";

const ChatPage: FC = () => {
    const { id } = useParams()
    const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoomResource | null>(null);
    const [showChatDetails, setShowChatDetails] = useState(true);


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
        {currentChatRoom && <ChatSidebar chatRoom={currentChatRoom} />}
        <div className="lg:col-span-8 xl:col-span-9 col-span-12 overflow-hidden">
            <div className="grid grid-cols-12 h-full overflow-hidden">
                {currentChatRoom && <ChatArea showChatDetails={showChatDetails} onToggleChatDetails={() => setShowChatDetails(!showChatDetails)} chatRoom={currentChatRoom} />}
                <div className={cn("overflow-hidden", showChatDetails ? 'col-span-4 md:block hidden' : 'hidden')}>
                    {currentChatRoom && <ChatDetails onFetch={fetchChatRoom} chatRoom={currentChatRoom} />}
                </div>
            </div>
        </div>
    </div>
};

export default ChatPage;
