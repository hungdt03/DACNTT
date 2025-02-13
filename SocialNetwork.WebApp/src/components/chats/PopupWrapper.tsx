import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { add, minimize, remove, selectChatPopup } from "../../features/slices/chat-popup-slice";
import ChatPopup from "./ChatPopup";
import SignalRConnector from '../../app/signalR/signalr-connection'
import { ChatRoomResource } from "../../types/chatRoom";
import chatRoomService from "../../services/chatRoomService";

const PopupWrapper: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { chatRooms } = useSelector(selectChatPopup);

     const getChatRoomById = async (chatRoomId: string): Promise<ChatRoomResource | undefined> => {
            const response = await chatRoomService.getChatRoomById(chatRoomId);
            if (response.isSuccess) {
                return response.data;
            }
    
            return undefined;
        }
    

    useEffect(() => {
        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                const chatRoom = chatRooms.find(c => c.chatRoom.id === message.chatRoomId);
                if (chatRoom) {
                    console.log(chatRoom)
                } else {
                    getChatRoomById(message.chatRoomId)
                        .then(data => {
                            if (data) dispatch(add(data));
                        });
                }
            },
        );

    }, [])

    return <div className="flex items-center gap-x-4">
        {chatRooms.map(item => item.state === 'open' && <ChatPopup onMinimize={() => dispatch(minimize(item.chatRoom.id))} onClose={() => dispatch(remove(item.chatRoom.id))} key={item.chatRoom.uniqueName} room={item.chatRoom} />)}
    </div>
};

export default PopupWrapper;
