import { Avatar } from "antd";
import { FC } from "react";
import images from "../../assets";
import { ChatRoomResource } from "../../types/chatRoom";
import { formatTime } from "../../utils/date";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";

type ChatUserItemProps = {
    chatRoom: ChatRoomResource;
    isActive: boolean
}

const ChatUserItem: FC<ChatUserItemProps> = ({
    chatRoom,
    isActive
}) => {
    return <Link to={`/chat/${chatRoom.id}`} className={cn("flex items-center gap-x-3 px-3 py-3 rounded-sm w-full hover:bg-gray-100", isActive && 'bg-gray-100')}>
        <div className="relative">
            <Avatar size='large' className="flex-shrink-0" src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} />
            {chatRoom.isOnline && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                <span className="text-[11px] text-gray-400">{formatTime(new Date(chatRoom.lastMessageDate))}</span>
            </div>
            <p className="truncate text-xs text-gray-400">{chatRoom.lastMessage}</p>
        </div>
    </Link>
};

export default ChatUserItem;
