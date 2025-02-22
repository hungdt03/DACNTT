import { Avatar, message, Tooltip } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import images from "../../assets";
import SignalRConnector from '../../app/signalR/signalr-connection'
import Message from "./messages/Message";
import BoxSendMessage, { BoxMessageType } from "./BoxSendMessage";
import { ChatRoomResource } from "../../types/chatRoom";
import { formatTime } from "../../utils/date";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { MinusOutlined } from '@ant-design/icons'
import { MessageMediaResource, MessageResource } from "../../types/message";
import { MessageRequest } from "./ChatPopup";
import messageService from "../../services/messageService";
import { imageTypes, videoTypes } from "../../utils/file";
import { MediaType } from "../../enums/media";
import { Pagination } from "../../types/response";
import cn from "../../utils/cn";
import LoadingIndicator from "../LoadingIndicator";
import userService from "../../services/userService";
import { BlockResource } from "../../types/block";

type ChatAreaProps = {
    chatRoom: ChatRoomResource;
    onToggleChatDetails: () => void;
    showChatDetails: boolean;
    onFetch: () => void
}

const ChatArea: FC<ChatAreaProps> = ({
    chatRoom,
    showChatDetails,
    onToggleChatDetails,
    onFetch
}) => {
    const { user } = useSelector(selectAuth);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isShowPrevent, setIsShowPrevent] = useState(false);
    const [blockUser, setBlockUser] = useState<BlockResource>()

    const [messages, setMessages] = useState<MessageResource[]>([]);
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
        chatRoomName: chatRoom.uniqueName
    });

    const [loading, setLoading] = useState(false)

    const fetchMessages = async (page: number, size: number) => {
        setLoading(true)
        const response = await messageService.getAllMessagesByChatRoomId(chatRoom.id, page, size);
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

    const loadMessages = async (page: number, size: number, chatRoomId: string) => {
        const response = await messageService.getAllMessagesByChatRoomId(chatRoomId, page, size);
        if (response.isSuccess) {
            setMessages(response.data)
            setPagination(response.pagination);

            if (messagesEndRef.current)
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
            onFetch()
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        chatRoom.isPrivate && chatRoom.friend && getBlock(chatRoom.friend?.id)

        loadMessages(1, 10, chatRoom.id);

        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                if (message.chatRoomId === chatRoom.id) {

                    if (message.isRemove && message.memberId === user?.id) {
                        onFetch()
                    }
                    setPendingMessages((prev) =>
                        prev.filter((m) => m.sentAt.getTime() !== new Date(message.sentAt).getTime())
                    );

                    setMessages((prev) => {
                        const updatedMessages = [...prev, message];

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
                    
                    if (messagesEndRef.current)
                        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            },
            // ON READ STATUS RECEIVE
            (message, userId) => {
                if (message.chatRoomId === chatRoom.id) {
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

                groupName === chatRoom.uniqueName && setTyping(content)
            },

            // ON STOP TYPING MESSAGE
            (groupName) => {
                groupName === chatRoom.uniqueName && setTyping('')
            },
            undefined,
            (chatRoomId: string) => {
                if (chatRoom.id === chatRoomId) {
                    onFetch()
                }
            },
            (chatRoomId: string) => {
                if (chatRoom.id === chatRoomId) {
                    onFetch()
                }
            }
        );

        setMsgPayload(prev => ({
            ...prev,
            chatRoomName: chatRoom.uniqueName
        }))

        if (messagesEndRef.current)
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });

        return () => {
            SignalRConnector.unsubscribeEvents()
        }

    }, [chatRoom]);

    useEffect(() => {
        setIsShowPrevent(chatRoom.isPrivate && !chatRoom.isAccept && !!chatRoom.lastMessage)
    }, [chatRoom])

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

        if (isShowPrevent) return;

        user && SignalRConnector.startTypingMessage(chatRoom.uniqueName, user?.fullName)
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            SignalRConnector.stopTypingMessage(chatRoom.uniqueName)
        }, 500);

    }

    const handleSendMessage = async () => {
        const tempMessage: MessageResource = {
            id: Date.now().toString(),
            content: msgPayload.content,
            senderId: user?.id!,
            chatRoomId: chatRoom.id,
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
            if (response.isSuccess && response.data) {
                const message = response.data
                if (message.chatRoomId === chatRoom.id) {
                    if (message.isRemove && message.memberId === user?.id) {
                        onFetch()
                    }
                    setPendingMessages((prev) =>
                        prev.filter((m) => m.sentAt.getTime() !== new Date(message.sentAt).getTime())
                    );
                    setMessages((prev) => {
                        const updatedMessages = [...prev, message];
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
                }
            }
        } else {
            msgPayload.sentAt = tempMessage.sentAt

            try {
                await SignalRConnector.sendMessage(msgPayload);
            } catch (error) {
                message.error(error as string)
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
        await messageService.readMessage(chatRoom.id);
    }

    const renderMessageBox = () => {
        if (chatRoom.isPrivate) {
            if (blockUser?.blockeeId === user?.id) {
                return (
                    <div className="w-full px-4 py-4 shadow flex flex-col items-center gap-y-2">
                        <span className="text-[14px] text-gray-500">Bạn không thể nhắn tin cho người này</span>
                    </div>
                );
            }
            if (blockUser?.blockerId === user?.id) {
                return (
                    <div className="w-full px-4 py-4 shadow flex flex-col items-center gap-y-2">
                        <span className="text-[14px] text-gray-500">Bạn đã chặn người này</span>
                        <button onClick={() => chatRoom.friend && handleUnblock(chatRoom.friend?.id)} className="px-3 py-[6px] text-sm font-bold rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200">Bỏ chặn</button>
                    </div>
                );
            }
        }

        return (
            <div className="w-full px-4 py-4 shadow">
                {isShowPrevent && (
                    <div className="flex flex-col gap-y-2 p-2 bg-white border-t-[1px] border-gray-500">
                        <p className="text-[12px] text-gray-400 text-center">
                            Nếu bạn trả lời, {chatRoom.friend?.fullName} cũng sẽ có thể xem các thông tin như Trạng thái hoạt động và thời điểm bạn đọc tin nhắn.
                        </p>
                        <div className="flex justify-center">
                            <button className="py-2 px-5 rounded-md text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200">Chặn</button>
                        </div>
                    </div>
                )}
                {typing && (
                    <div key={chatRoom.id} className="ml-2 text-[10px] text-white px-2 bg-sky-400 rounded-md inline-block animate-bounce">
                        {typing}
                    </div>
                )}
                <BoxSendMessage
                    value={msgPayload.content}
                    onChange={handleBoxChange}
                    onSubmit={handleSendMessage}
                    onFocus={handleReadMessage}
                />
            </div>
        );
    };

    return <div className={cn("flex flex-col h-full overflow-hidden col-span-12", !showChatDetails ? 'md:col-span-12' : 'md:col-span-8')}>
        <div className="flex items-center justify-between p-4 shadow">
            <div className="flex justify-center items-center gap-x-3">
                <div className="relative">
                    <Avatar className="w-12 h-12" size='large' src={chatRoom.isPrivate ? chatRoom.friend?.avatar : chatRoom.imageUrl ?? images.group} />
                    {chatRoom.isOnline && (!chatRoom.isPrivate || (chatRoom.isPrivate && chatRoom.friend?.isShowStatus)) && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>}
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-semibold">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                    <p className="text-[13px] text-gray-600">{chatRoom.isOnline && (!chatRoom.isPrivate || (chatRoom.isPrivate && chatRoom.friend?.isShowStatus)) ? 'Đang hoạt động' : (!chatRoom.isPrivate || (chatRoom.isPrivate && chatRoom.friend?.isShowStatus)) && `Hoạt động ${formatTime(new Date(chatRoom.recentOnlineTime))}`}</p>
                </div>
            </div>

            <div className="flex gap-x-1 items-center">
                <Tooltip placement="left" title="Thông tin cuộc trò chuyện">
                    <button onClick={() => onToggleChatDetails()} className="p-2 bg-transparent border-none">
                        <MinusOutlined />
                    </button>
                </Tooltip>
            </div>
        </div>

        <div className="flex flex-col h-full gap-y-3 w-full overflow-y-auto custom-scrollbar p-4">
            {!pagination.hasMore && chatRoom.isPrivate && chatRoom.friend && <div className="flex flex-col gap-y-1 items-center">
                <Avatar src={chatRoom.friend.avatar} className="w-[80px] h-[80px]" />
                <span className="text-sm text-gray-600 font-bold">{chatRoom.friend.fullName}</span>
                <span className="text-xs text-gray-600">
                    {!chatRoom.isFriend && !chatRoom.isConnect && 'Các bạn không phải là bạn bè trên LinkUp'}
                    {chatRoom.isFriend && 'Các bạn là bạn bè trên LinkUp'}
                    {!chatRoom.isFriend && chatRoom.isConnect && 'Các bạn hiện đã được kết nối với nhau'}
                </span>
            </div>}

            {!pagination.hasMore && !chatRoom.isPrivate && <div className="flex flex-col gap-y-1 items-center">
                <Avatar src={chatRoom.imageUrl ?? images.group} className="w-[80px] h-[80px]" />
                <span className="text-sm text-gray-600 font-bold">{chatRoom.name}</span>
            </div>}

            {loading && <LoadingIndicator />}
            {pagination.hasMore && !loading && <button onClick={() => fetchMessages(pagination.page + 1, pagination.size)} className="w-full text-gray-500 my-2 text-sm">Tải thêm tin nhắn</button>}
            {[...messages, ...pendingMessages].map(message => <Message chatRoom={chatRoom} key={message.id} message={message} isMe={message.senderId === user?.id} />)}
            <div ref={messagesEndRef}></div>
        </div>

        {renderMessageBox()}

    </div>
};

export default ChatArea;
