import { FC, useEffect, useRef, useState } from "react";
import { CloseOutlined, MinusOutlined, DownOutlined } from '@ant-design/icons'
import images from "../../assets";
import Message from "./messages/Message";
import { ChatRoomResource } from "../../types/chatRoom";
import SignalRConnector from '../../app/signalR/signalr-connection'
import { MessageMediaResource, MessageResource } from "../../types/message";
import messageService from "../../services/messageService";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import BoxSendMessage, { BoxMessageType } from "./BoxSendMessage";
import { Avatar, message, Popover, Tooltip, UploadFile } from "antd";
import { imageTypes, videoTypes } from "../../utils/file";
import { MediaType } from "../../enums/media";
import { formatTime } from "../../utils/date";
import { Link } from "react-router-dom";
import cn from "../../utils/cn";
import { setChatRoomAccepted, setChatRoomRead } from "../../features/slices/chat-popup-slice";
import { AppDispatch } from "../../app/store";
import { Pagination } from "../../types/response";
import { BlockResource } from "../../types/block";
import userService from "../../services/userService";
import LoadingIndicator from "../LoadingIndicator";
import chatRoomService from "../../services/chatRoomService";
import { FriendRequestResource } from "../../types/friendRequest";

export type MessageRequest = {
    content: string;
    chatRoomName: string;
    sentAt?: Date;
    images?: UploadFile[]
    videos?: UploadFile[];
    receiverId?: string;
}

type ChatPopupProps = {
    room: ChatRoomResource;
    onClose?: () => void;
    onMinimize?: () => void;
}

const ChatPopup: FC<ChatPopupProps> = ({
    room: roomParam,
    onClose,
    onMinimize,
}) => {

    const { user } = useSelector(selectAuth);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<MessageResource[]>([])
    const [isRead, setIsRead] = useState(roomParam.isRead);
    const [isShowPrevent, setIsShowPrevent] = useState(false);
    const [room, setRoom] = useState<ChatRoomResource>(roomParam);

    const [blockUser, setBlockUser] = useState<BlockResource>()

    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        size: 10,
        hasMore: false
    })

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [typing, setTyping] = useState<string>('');
    const [pendingMessages, setPendingMessages] = useState<MessageResource[]>([]);

    const [msgPayload, setMsgPayload] = useState<MessageRequest>({
        content: '',
        chatRoomName: room.uniqueName
    });

    const dispatch = useDispatch<AppDispatch>()

    const fetchMessages = async (page: number, size: number) => {
        setLoading(true)
        const response = await messageService.getAllMessagesByChatRoomId(room.id, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setMessages(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const news = response.data.filter(item => !existingIds.has(item.id));
                return [...news, ...prev];
            });

            setPagination(response.pagination)
        }
    }


    const getBlock = async (userId: string) => {
        const response = await userService.getBlockUser(userId);
        if (response.isSuccess) {
            setBlockUser(response.data)
        } else {
            setBlockUser(undefined)
        }
    }

    const handleUnblock = async (userId: string) => {
        const response = await userService.unblockUser(userId);
        if (response.isSuccess) {
            message.success(response.message)
            getBlock(userId)
            fetchRoom()
        } else {
            message.error(response.message)
        }
    }

    const fetchRoom = async () => {
        const response = await chatRoomService.getChatRoomById(roomParam.id);
        if (response.isSuccess) {
            setRoom(response.data)
        }
    }

    const handleBlockUser = async (userId: string) => {
        const response = await userService.blockUser(userId);
        if (response.isSuccess) {
            message.success(response.message)
            getBlock(userId)
            fetchRoom()
        } else {
            message.error(response.message)
        }
    }


    useEffect(() => {
        fetchMessages(pagination.page, pagination.size);
        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                if (message.chatRoomId === room.id) {
                    setPendingMessages((prev) =>
                        prev.filter((m) => m.sentAt.getTime() !== new Date(message.sentAt).getTime())
                    );

                    setMessages((prev) => {
                        const updatedMessages = [...prev];
                        updatedMessages.push(message)
                        if (message.senderId !== user?.id) {
                            const findIndex = updatedMessages.findIndex(msg => msg.reads?.some(t => t.userId === message.senderId));

                            if (findIndex !== -1) {
                                updatedMessages[findIndex].reads = [
                                    ...(updatedMessages[findIndex]?.reads?.filter(r => r.userId !== message.senderId) || [])
                                ];
                            }
                        }

                        return updatedMessages;
                    });

                    if (message.senderId !== user?.id)
                        setIsRead(false)

                    if(message.isFetch) {
                        setIsShowPrevent(false)
                        dispatch(setChatRoomAccepted(room.id));
                        fetchRoom()
                    }
                }
            },
            // ON READ STATUS RECEIVE
            (message, userId) => {
                if (message.chatRoomId === room.id) {
                    if (message.senderId !== user?.id) {
                        setIsRead(true)
                    }

                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages];



                        if (userId !== user?.id) {
                            const findIndex = updatedMessages.findIndex(msg => msg.reads?.some(t => t.userId === userId));

                            if (findIndex !== -1) {
                                updatedMessages[findIndex].reads = [
                                    ...(updatedMessages[findIndex]?.reads?.filter(r => r.userId !== userId) || [])
                                ];
                            }

                            updatedMessages[updatedMessages.length - 1].reads = [...(message.reads ?? [])];
                        }

                        return updatedMessages;
                    });
                }
            },
            // ON TYPING MESSAGE
            (groupName, content) => {
                groupName === room.uniqueName && setTyping(content)
            },

            // ON STOP TYPING MESSAGE
            (groupName) => {
                groupName === room.uniqueName && setTyping('')
            },
            undefined,
            (chatRoomId: string) => {
                if (room.id === chatRoomId) {
                    fetchRoom()
                }
            }
        );
    }, []);

    useEffect(() => {
        room.isPrivate && room.friend && getBlock(room.friend?.id)

        setIsShowPrevent(room.isPrivate && !room.isAccept && !!room.lastMessage)
    }, [room])


    useEffect(() => {
        if (messagesEndRef.current && pagination.page === 1)
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    const handleBoxChange = (value: BoxMessageType) => {

        let updateState: MessageRequest = {
            ...msgPayload,
            content: value.content
        }

        if (value.files) {
            const imageFiles = value.files
                .filter(file => imageTypes.includes(file.type as string) || (file.type as string).includes("image/"))

            const videoFiles = value.files
                .filter(file => videoTypes.includes(file.type as string) || (file.type as string).includes("video/"))

            updateState = {
                ...updateState,
                images: imageFiles,
                videos: videoFiles
            }
        }

        setMsgPayload(updateState);

        user && SignalRConnector.startTypingMessage(room.uniqueName, user?.fullName)
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }


        typingTimeoutRef.current = setTimeout(() => {
            SignalRConnector.stopTypingMessage(room.uniqueName)
        }, 500);

    }

    const handleSendMessage = async () => {
        const tempMessage: MessageResource = {
            id: Date.now().toString(),
            content: msgPayload.content,
            senderId: user?.id!,
            chatRoomId: room.id,
            sentAt: new Date(),
            status: 'sending',
            medias: [],
            sender: user!,
        };

        setPendingMessages(prev => [...prev, tempMessage]);

        if ((msgPayload.images && msgPayload.images.length > 0) || (msgPayload.videos && msgPayload.videos.length > 0)) {
            const formData = new FormData();

            msgPayload?.images?.forEach(file => {

                if (file.originFileObj) {
                    formData.append('images', file.originFileObj, file.name);

                    tempMessage.medias.push({
                        id: file.uid,
                        mediaUrl: URL.createObjectURL(file.originFileObj),
                        mediaType: MediaType.IMAGE
                    } as MessageMediaResource)
                }
            });

            msgPayload?.videos?.forEach(file => {

                if (file.originFileObj) {

                    formData.append('videos', file.originFileObj, file.name);
                    tempMessage.medias.push({
                        id: file.uid,
                        mediaUrl: URL.createObjectURL(file.originFileObj),
                        mediaType: MediaType.VIDEO
                    } as MessageMediaResource)
                }
            });

            formData.append('content', msgPayload.content);
            formData.append('chatRoomName', msgPayload.chatRoomName);
            const sentAt = tempMessage.sentAt.toISOString();
            formData.append('sentAt', sentAt);

            const response = await messageService.sendMessage(formData);
            if(!response.isSuccess) {
                message.error(response.message)
            }
            
        } else {

            msgPayload.sentAt = tempMessage.sentAt

            try {
                await SignalRConnector.sendMessage(msgPayload)
                
            } catch (error) {
                alert(error)
            }
        }

        setMsgPayload({
            ...msgPayload,
            content: '',
            images: [],
            videos: []
        })

    }

    const handleReadMessage = async () => {
        await messageService.readMessage(room.id);
        dispatch(setChatRoomRead(room.id));
        setIsRead(true)
    }

    const renderMessageBox = () => {
        if (room.isPrivate) {
            if (blockUser?.blockeeId === user?.id) {
                return (
                    <div className="sticky bottom-0 p-4 shadow border-t-[1px] flex justify-center">
                        <span className="text-xs text-gray-500">Bạn không thể nhắn tin cho người này</span>
                    </div>
                );
            }
            if (blockUser?.blockerId === user?.id) {
                return (
                    <div className="sticky bottom-0 p-2 shadow border-t-[1px] flex flex-col items-center gap-y-1">
                        <span className="text-xs text-gray-500">Bạn đã chặn người này</span>
                        <button onClick={() => room.friend && handleUnblock(room.friend?.id)} className="px-2 py-[4px] font-semibold rounded-md bg-gray-100 text-gray-500 text-xs hover:bg-gray-200">Bỏ chặn</button>
                    </div>
                );
            }
        }

        return (
            <div className="sticky bottom-0">
                {isShowPrevent && <div className="flex flex-col gap-y-2 p-3 bg-white border-b-[1px] border-t-[1px] border-gray-300">
                    <p className="text-[12px] text-gray-400 text-center">Nếu bạn trả lời, {room.friend?.fullName} cũng sẽ có thể xem các thông tin như Trạng thái hoạt động và thời điểm bạn đọc tin nhắn.</p>

                    <div className="flex justify-center">
                        <button onClick={() => room.friend && handleBlockUser(room.friend?.id)} className="py-2 px-5 rounded-md text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200">Chặn</button>
                    </div>
                </div>}
                {typing && <div key={room.id} className="ml-2 text-[10px] text-white px-2 bg-sky-400 rounded-md inline-block animate-bounce">
                    {typing}
                </div>}
                <div className="p-3 bg-white shadow border-t-[1px] border-gray-100">
                    <BoxSendMessage
                        value={msgPayload.content}
                        onChange={handleBoxChange}
                        onSubmit={handleSendMessage}
                        onFocus={() => handleReadMessage()}
                    />
                </div>

            </div>
        );
    }

    return <div className="w-[320px] z-[200] relative bg-white rounded-t-xl overflow-hidden shadow-md">
        <div className={cn("z-[200] text-white shadow-md flex items-center justify-between border-[1px] border-gray-200 p-[2px]", isRead ? ' bg-white' : 'bg-sky-500')}>
            <Popover trigger='click' content={<div className="flex flex-col gap-y-2">
                {room.isPrivate && <Link to={`/profile/${room.friend?.id}`} className="px-2 py-1 rounded-md hover:bg-gray-100 w-full hover:text-black">Trang cá nhân</Link>}
                <Link to={`/chat/${room.id}`} className="px-2 py-1 rounded-md hover:bg-gray-100 w-full hover:text-black">Mở trong messenger</Link>
            </div>}>
                <div className={cn("flex items-center gap-x-2 rounded-md p-1 cursor-pointer", !isRead ? 'hover:bg-sky-600 bg-opacity-10' : 'hover:bg-gray-100')}>
                    <div className="relative flex-shrink-0">
                        <img
                            src={room.friend?.avatar ?? images.group}
                            alt="Avatar"
                            className="w-[40px] h-[40px] rounded-full object-cover"
                        />
                        {room.isOnline && (!room.isPrivate || (room.isPrivate && room.friend?.isShowStatus)) && <span className="absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full border-2 border-white bg-green-500"></span>}
                    </div>

                    <div className="flex flex-col flex-shrink-0">
                        <b className={cn("text-sm", isRead && 'text-black')}>{room.isPrivate ? room.friend?.fullName : room.name}</b>
                        <div className={cn("text-[12px] flex items-center gap-x-2", isRead && 'text-gray-400')}>
                            {room.isOnline && (!room.isPrivate || (room.isPrivate && room.friend?.isShowStatus)) ? 'Đang hoạt động' : (!room.isPrivate || (room.isPrivate && room.friend?.isShowStatus)) && `Hoạt động ${formatTime(new Date(room.recentOnlineTime))}`}
                            <span><DownOutlined className="text-gray-500" /></span>
                        </div>
                    </div>

                </div>
            </Popover>

            <div className={cn("flex gap-x-1 items-center", isRead && 'text-sky-500')}>
                <Tooltip title="Thu nhỏ đoạn chat">
                    <button onClick={() => onMinimize?.()} className="p-2 bg-transparent border-none">
                        <MinusOutlined />
                    </button>
                </Tooltip>

                <Tooltip title="Đóng đoạn chat">
                    <button onClick={() => onClose?.()} className="p-2 bg-transparent border-none">
                        <CloseOutlined />
                    </button>
                </Tooltip>
            </div>
        </div>

        <div className={cn("overflow-y-auto px-2 py-3 custom-scrollbar flex flex-col gap-y-3", isShowPrevent && !blockUser ? 'h-[220px]' : 'h-[330px]')}>
            {!pagination.hasMore && room.isPrivate && room.friend && <div className="flex flex-col gap-y-1 items-center">
                <Avatar src={room.friend.avatar} size={'large'} />
                <span className="text-sm text-gray-600 font-bold">{room.friend.fullName}</span>
                <span className="text-xs text-gray-600">
                    {room.isFriend && 'Các bạn là bạn bè trên LinkUp'}
                    {!room.isFriend && !room.isConnect && 'Các bạn không phải là bạn bè trên LinkUp'}
                    {!room.isFriend && room.isConnect && 'Các bạn hiện đã được kết nối với nhau'}
                </span>
            </div>}

            {!pagination.hasMore && !room.isPrivate && <div className="flex flex-col gap-y-1 items-center">
                <Avatar src={room.imageUrl} size={'large'} />
                <span className="text-sm text-gray-600 font-bold">{room.name}</span>
            </div>}

            {loading && <LoadingIndicator />}
            {pagination.hasMore && !loading && <button onClick={() => fetchMessages(pagination.page + 1, pagination.size)} className="w-full text-primary my-2 text-xs">Tải thêm tin nhắn</button>}
            {[...messages, ...pendingMessages].map(message => <Message chatRoom={room} key={message.id} message={message} isMe={message.senderId === user?.id} />)}
            <div ref={messagesEndRef}></div>
        </div>

        {renderMessageBox()}

    </div >

};

export default ChatPopup;
