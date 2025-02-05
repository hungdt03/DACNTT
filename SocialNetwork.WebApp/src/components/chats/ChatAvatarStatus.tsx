import { Avatar } from "antd";
import { FC } from "react";
import images from "../../assets";
import { ChatRoomResource } from "../../types/chatRoom";
import { Link } from "react-router-dom";

type ChatAvatarStatusProps = {
    chatRoom: ChatRoomResource
}

const ChatAvatarStatus: FC<ChatAvatarStatusProps> = ({
    chatRoom
}) => {
    return <Link to={`/chat/${chatRoom.id}`} className="flex items-center justify-between px-2 py-2 rounded-md">
        <div className="flex flex-col justify-center items-center gap-x-3">
            <div className="relative">
                {chatRoom.isPrivate && chatRoom.friend?.haveStory
                    ? <Link to={`/stories/${chatRoom.friend.id}`} className="inline-block rounded-full p-[1px] border-[2px] border-primary"><Avatar size='large' src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} /></Link>
                    : <Avatar size='large' className="w-12 h-12 flex-shrink-0" src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} />
                }
                <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
            </div>
            <span className="font-medium text-xs w-12 text-center line-clamp-2">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
        </div>
    </Link>
};

export default ChatAvatarStatus;
