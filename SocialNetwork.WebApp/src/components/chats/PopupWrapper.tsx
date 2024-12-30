import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import useWebRtc from "../../hooks/useWebRtc";
import { add, expand, minimize, remove, selectChatPopup } from "../../features/slices/chat-popup-slice";
import ChatPopup from "./ChatPopup";
import SignalRConnector from "../../app/signalR/signalr-connection";
import chatRoomService from "../../services/chatRoomService";
import { ChatRoomResource } from "../../types/chatRoom";


const PopupWrapper: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { handleCallUser } = useWebRtc();
    const { chatRooms } = useSelector(selectChatPopup);
    

    const getChatRoomById = async (chatRoomId: string) : Promise<ChatRoomResource | undefined> => {
        const response = await chatRoomService.getChatRoomById(chatRoomId);
        if(response.isSuccess) {
            return response.data;
        }

        return undefined;
    }

    useEffect(() => {
        SignalRConnector.onMessageReceived = async (message) => {
         
            const sender = message.sender;

            const chatRoom = chatRooms.find(item => item.chatRoom.friend?.id === sender.id);
            if(chatRoom && chatRoom.state === 'minimize') {
                dispatch(expand(chatRoom.chatRoom.id))
            } else if(!chatRoom) {
                const data = await getChatRoomById(message.chatRoomId)
                if(data) dispatch(add(data))
            }
        }
    }, [])

    return chatRooms.map(item => item.state === 'open' && <ChatPopup onCalling={() => item.chatRoom.friend && handleCallUser(item.chatRoom.friend)} onMinimize={() => dispatch(minimize(item.chatRoom.id))} onClose={() => dispatch(remove(item.chatRoom.id))} key={item.chatRoom.id} room={item.chatRoom} />)
};

export default PopupWrapper;
