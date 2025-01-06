import { FC } from "react";
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import ChatMinimizePopup from "./ChatMinimizePopup";
import { expand, remove, selectChatPopup, setChatRoomRead } from "../../features/slices/chat-popup-slice";
import messageService from "../../services/messageService";
import { ChatRoomResource } from "../../types/chatRoom";

const MinimizePopupWrapper: FC = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { chatRooms } = useSelector(selectChatPopup);

    const handleReadMessage = async (room: ChatRoomResource) => {
        const response = await messageService.readMessage(room.id);
        dispatch(expand(room.id));
        dispatch(setChatRoomRead(room.id));
    }

    return chatRooms.map(item => item.state === 'minimize' && <ChatMinimizePopup key={item.chatRoom.uniqueName} onClose={() => dispatch(remove(item.chatRoom.id))} onClick={() => handleReadMessage(item.chatRoom)} chatRoom={item.chatRoom} />)
};

export default MinimizePopupWrapper;
