import { FC } from "react";
import { ChatRoomResource } from "../../types/chatRoom";
import { CloseOutlined } from '@ant-design/icons';
import { Avatar, Popover } from "antd";
import images from "../../assets";

type ChatMinimizePopupProps = {
    chatRoom: ChatRoomResource;
    onClose: () => void;
    onClick: () => void
}

const ChatMinimizePopup: FC<ChatMinimizePopupProps> = ({
    chatRoom,
    onClose,
    onClick
}) => {
    return <Popover  key={chatRoom.id} placement="left" content={<div className="flex flex-col p-0">
        <p className="font-bold">{chatRoom.isPrivate ? chatRoom?.friend?.fullName : chatRoom.name}</p>
        <p className="w-36 truncate text-gray-500">{chatRoom?.lastMessage}</p>
    </div>}>
        <div className="relative group">
            <Avatar
                className="cursor-pointer shadow-xl w-12 h-12"
                src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group}
                onClick={() => onClick()}
            />

            <button onClick={() => onClose()} className="absolute -top-1 -right-1 hidden group-hover:block transition-all ease-linear duration-300">
                <CloseOutlined className="text-[11px] w-5 h-5 flex items-center justify-center rounded-full bg-white"/>
            </button>
        </div>
    </Popover>
};

export default ChatMinimizePopup;
