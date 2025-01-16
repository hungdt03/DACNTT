import { Avatar } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { ChatRoomResource } from "../../types/chatRoom";
import { formatTime } from "../../utils/date";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";
import SignalRConnector from '../../app/signalR/signalr-connection'
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

type ChatUserItemProps = {
    chatRoom: ChatRoomResource;
    isActive: boolean
}

const ChatUserItem: FC<ChatUserItemProps> = ({
    chatRoom,
    isActive
}) => {
    const [lastMessage, setLastMessage] = useState(chatRoom.lastMessage)
    const [lastMessageDate, setLastMessageDate] = useState<Date>(chatRoom.lastMessageDate)
    const [isRead, setIsRead] = useState(chatRoom.isRead);
    const { user } = useSelector(selectAuth)

    useEffect(() => {
        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                if (message.chatRoomId === chatRoom.id) {
                    if(user?.id !== message.senderId)
                        setIsRead(false)

                    setLastMessageDate(message.sentAt)
                    if (message.medias.length > 0) {
                        setLastMessage(`${message.sender.fullName} đã gửi ${message.medias.length} file`)
                    } else
                        setLastMessage(message.content)
                }
            },
            (message, userId) => {
                if (message.chatRoomId === chatRoom.id && message.senderId !== user?.id) {
                    setIsRead(true)
                }
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        );
    }, [chatRoom]);

    return <Link to={`/chat/${chatRoom.id}`} className={cn("flex items-center gap-x-3 px-3 py-3 rounded-sm w-full hover:bg-gray-100", isActive && 'bg-gray-100')}>
        <div className="relative">
            <Avatar size='large' className="flex-shrink-0" src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} />
            {chatRoom.isOnline && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                <span className={cn("text-[11px]", isRead ? 'text-gray-400' : 'text-primary font-semibold')}>{formatTime(new Date(lastMessageDate))}</span>
            </div>
            <p className={cn("truncate text-xs", isRead ? 'text-gray-400' : 'font-semibold text-black')}>{lastMessage}</p>
        </div>

        {!isRead && <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full">
            </div>
        </div>}
    </Link>
};

export default ChatUserItem;
