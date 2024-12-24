import { FC } from "react";
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import ChatMinimizePopup from "./ChatMinimizePopup";
import { expand, remove, selectChatPopup } from "../../features/slices/chat-popup-slice";

const MinimizePopupWrapper: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { chatRooms } = useSelector(selectChatPopup);

    return chatRooms.map(item => item.state === 'minimize' && <ChatMinimizePopup key={item.chatRoom.id} onClose={() => dispatch(remove(item.chatRoom.id))} onClick={() => dispatch(expand(item.chatRoom.id))} chatRoom={item.chatRoom} />)
};

export default MinimizePopupWrapper;
