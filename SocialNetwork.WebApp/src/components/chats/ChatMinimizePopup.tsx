import { FC, useEffect, useState } from "react";
import { ChatRoomResource } from "../../types/chatRoom";
import { CloseOutlined } from '@ant-design/icons';
import { Avatar, Badge, Popover } from "antd";
import images from "../../assets";
import SignalRConnector from '../../app/signalR/signalr-connection'
import { Ellipsis } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setChatRoomMessage } from "../../features/slices/chat-popup-slice";

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
    const [typing, setTyping] = useState('');
    const [count, setCount] = useState(0);
    const [hover, setHover] = useState(false);

    const dispatch = useDispatch<AppDispatch>()


    useEffect(() => {
        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                if (message.chatRoomId === chatRoom.id) {
                    setCount(prev => {
                        console.log(prev)
                        return prev + 1
                    })
                    dispatch(setChatRoomMessage({
                        chatRoomId: message.chatRoomId,
                        message: message.content,
                        sentAt: message.sentAt
                    }))
                }
            },
            undefined,
            // ON TYPING MESSAGE
            (groupName, content) => {
                groupName === chatRoom.uniqueName && setTyping(content)
            },

            // ON STOP TYPING MESSAGE
            (groupName) => {
                groupName === chatRoom.uniqueName && setTyping('')
            },
            undefined,
            undefined,
            undefined,
            undefined,
        );

    }, []);

    return <Popover key={chatRoom.id} placement="left" content={<div className="flex flex-col p-0">
        <p className="font-bold">{chatRoom.isPrivate ? chatRoom?.friend?.fullName : chatRoom.name}</p>
        <div className="flex items-center gap-x-2">
            {!chatRoom.isRead && <div className="w-2 h-2 rounded-full bg-blue-500">
            </div>}
            <p className="w-36 truncate text-gray-500">{chatRoom?.lastMessage}</p>
        </div>
    </div>}>
        <Badge count={!hover ? count : ''}>
            <div onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} className="relative group">
                <Avatar
                    className="cursor-pointer shadow-xl w-12 h-12"
                    src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group}
                    onClick={() => onClick()}
                />

                {typing ? <div className="absolute right-0 w-8 h-4 bottom-0 flex items-center justify-center rounded-2xl bg-white border-[1px] border-gray-200">
                    <Ellipsis className="animate-bounce text-gray-400" />
                </div>
                    : chatRoom.isOnline && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                }

                <button onClick={() => onClose()} className="absolute -top-1 -right-1 hidden group-hover:block transition-all ease-linear duration-300">
                    <CloseOutlined className="text-[11px] w-5 h-5 flex items-center justify-center rounded-full bg-white" />
                </button>
            </div>
        </Badge>
    </Popover>
};

export default ChatMinimizePopup;
