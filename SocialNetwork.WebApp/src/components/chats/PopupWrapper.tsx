import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { minimize, remove, selectChatPopup } from "../../features/slices/chat-popup-slice";
import ChatPopup from "./ChatPopup";

const PopupWrapper: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { chatRooms } = useSelector(selectChatPopup);

    return <div className="flex items-center gap-x-4">
        {chatRooms.map(item => item.state === 'open' && <ChatPopup onMinimize={() => dispatch(minimize(item.chatRoom.id))} onClose={() => dispatch(remove(item.chatRoom.id))} key={item.chatRoom.uniqueName} room={item.chatRoom} />)}
    </div>
};

export default PopupWrapper;
