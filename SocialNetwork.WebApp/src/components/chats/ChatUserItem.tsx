import { Avatar } from "antd";
import { FC } from "react";
import images from "../../assets";
import { ChatRoomResource } from "../../types/chatRoom";
import { formatTime } from "../../utils/date";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";

type ChatUserItemProps = {
    chatRoom: ChatRoomResource;
    isActive: boolean;
    onClick: () => void
}

const ChatUserItem: FC<ChatUserItemProps> = ({
    chatRoom,
    isActive,
    onClick
}) => {

    return <div onClick={onClick} className={cn("cursor-pointer flex items-center gap-x-3 px-3 py-3 rounded-sm w-full hover:bg-gray-100", isActive && 'bg-gray-100')}>
        <div className="relative">
            {chatRoom.isPrivate && chatRoom.friend?.haveStory
                ? <Link to={`/stories/${chatRoom.friend.id}`} className="inline-block rounded-full p-[1px] border-[2px] border-primary"><Avatar size='default' src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} /></Link>
                : <Avatar size='large' className="flex-shrink-0" src={chatRoom.isPrivate ? chatRoom.friend?.avatar : chatRoom.imageUrl} />
            }

            {chatRoom.isOnline && (!chatRoom.isPrivate || (chatRoom.isPrivate && chatRoom.friend?.isShowStatus)) && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-sm line-clamp-1">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                <span className={cn("text-[11px] line-clamp-1 flex-shrink-0", chatRoom.isRead ? 'text-gray-400' : 'text-primary font-semibold')}>{formatTime(new Date(chatRoom.lastMessageDate))}</span>
            </div>
            <p className={cn("text-[12px] line-clamp-1", chatRoom.isRead ? 'text-gray-400' : 'font-semibold text-black')}>{chatRoom.lastMessage}</p>
        </div>

        {!chatRoom.isRead && <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full">
            </div>
        </div>}
    </div>
};

export default ChatUserItem;
