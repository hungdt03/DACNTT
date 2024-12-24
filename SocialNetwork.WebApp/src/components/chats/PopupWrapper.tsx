import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import useWebRtc from "../../hooks/useWebRtc";
import { minimize, remove, selectChatPopup } from "../../features/slices/chat-popup-slice";
import ChatPopup from "./ChatPopup";


const PopupWrapper: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { handleCallUser } = useWebRtc();
    const { chatRooms } = useSelector(selectChatPopup);

    return chatRooms.map(item => item.state === 'open' && <ChatPopup onCalling={() => item.chatRoom.friend && handleCallUser(item.chatRoom.friend)} onMinimize={() => dispatch(minimize(item.chatRoom.id))} onClose={() => dispatch(remove(item.chatRoom.id))} key={item.chatRoom.id} room={item.chatRoom} />)
};

export default PopupWrapper;
