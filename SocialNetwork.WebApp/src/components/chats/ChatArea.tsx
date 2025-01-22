import { Avatar, Tooltip } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import images from "../../assets";
import SignalRConnector from '../../app/signalR/signalr-connection'
import Message from "./messages/Message";
import BoxSendMessage, { BoxMessageType } from "./BoxSendMessage";
import { ChatRoomResource } from "../../types/chatRoom";
import { formatTime } from "../../utils/date";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { MinusOutlined, PhoneOutlined } from '@ant-design/icons'
import { MessageMediaResource, MessageResource } from "../../types/message";
import { MessageRequest } from "./ChatPopup";
import messageService from "../../services/messageService";
import { imageTypes, videoTypes } from "../../utils/file";
import { MediaType } from "../../enums/media";
import { Pagination } from "../../types/response";
import cn from "../../utils/cn";

type ChatAreaProps = {
    chatRoom: ChatRoomResource;
    onToggleChatDetails: () => void;
    showChatDetails: boolean;
}

const ChatArea: FC<ChatAreaProps> = ({
    chatRoom,
    showChatDetails,
    onToggleChatDetails
}) => {
    const { user } = useSelector(selectAuth);
    const messagesEndRef = useRef<HTMLDivElement>(null);
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
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const fetchMessages = async (page: number, size: number) => {
        setLoading(true)
        const response = await messageService.getAllMessagesByChatRoomId(chatRoom.id, page, size);
        setTimeout(() =>  setLoading(false), 1000)
        if (response.isSuccess) {
            setMessages(prevMessages => [...response.data, ...prevMessages])
            setPagination(response.pagination)

                    
            if (containerRef.current) {
                containerRef.current.scrollBy({ top: 50, behavior: 'instant' }); 
            }
        }
    }

    const loadMessages = async (page: number, size: number, chatRoomId: string) => {
        const response = await messageService.getAllMessagesByChatRoomId(chatRoomId, page, size);
        if (response.isSuccess) {
            setMessages(response.data)
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        loadMessages(1, 10, chatRoom.id);

        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                console.log('Receive message in chat area')
                if (message.chatRoomId === chatRoom.id) {
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
            undefined,
            undefined,
            undefined,
        );

        setMsgPayload(prev => ({
            ...prev,
            chatRoomName: chatRoom.uniqueName
        }))

        return () => {
            SignalRConnector.unsubscribeEvents()
        }
    }, [chatRoom]);

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
            sender: user!
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
            console.log(response)
        } else {
            msgPayload.sentAt = tempMessage.sentAt
            try {
                SignalRConnector.sendMessage(msgPayload)
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
        const response = await messageService.readMessage(chatRoom.id);
        console.log(response.message)
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    pagination.hasMore && !loading && fetchMessages(pagination.page + 1, pagination.size)
               
                }
            },
            { root: containerRef.current, rootMargin: '0px' }
        );

        observerRef.current = observer;

        const triggerElement = document.getElementById('messenger-scroll-trigger');
        if (triggerElement) {
            observer.observe(triggerElement);
        }

        return () => {
            if (observerRef.current && triggerElement) {
                observer.unobserve(triggerElement);
            }
        };
    }, [pagination, loading]);

    return <div className={cn("flex flex-col h-full overflow-hidden col-span-12", !showChatDetails ? 'md:col-span-12' : 'md:col-span-8')}>
        <div className="flex items-center justify-between p-4 shadow">
            <div className="flex justify-center items-center gap-x-3">
                <div className="relative">
                    <Avatar className="w-12 h-12" size='large' src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} />
                    {chatRoom.isOnline && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>}
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-semibold">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                    <p className="text-sm text-gray-600">{chatRoom.isOnline ? 'Đang hoạt động' : `Hoạt động ${formatTime(new Date(chatRoom.recentOnlineTime))}`}</p>
                </div>
            </div>

            <div className="flex gap-x-1 items-center">
                <Tooltip title="Gọi điện">
                    <button onClick={() => { }} className="p-2 bg-transparent border-none">
                        <PhoneOutlined className="rotate-90" />
                    </button>
                </Tooltip>
                <Tooltip placement="left" title="Thông tin cuộc trò chuyện">
                    <button onClick={() => onToggleChatDetails()} className="p-2 bg-transparent border-none">
                        <MinusOutlined />
                    </button>
                </Tooltip>
            </div>
        </div>

        <div ref={containerRef} className="flex flex-col h-full gap-y-3 w-full overflow-y-auto custom-scrollbar p-4">
            {!pagination.hasMore && !loading && (
                <p className="text-center text-gray-500 text-sm">Không còn tin nhắn nào để tải.</p>
            )}
            {loading && <p className="text-center text-gray-500 text-sm">Đang tải tin nhắn ...</p>}
            <div id="messenger-scroll-trigger" className="w-full h-1" />

            {[...messages, ...pendingMessages].map(message => <Message chatRoom={chatRoom} key={message.id} message={message} isMe={message.senderId === user?.id} />)}
            <div ref={messagesEndRef}></div>
        </div>

        <div className="w-full px-4 py-4 shadow">
            {typing && <div key={chatRoom.id} className="ml-2 text-[10px] text-white px-2 bg-sky-400 rounded-md inline-block animate-bounce">
                {typing}
            </div>}
            <BoxSendMessage
                value={msgPayload.content}
                onChange={handleBoxChange}
                onSubmit={handleSendMessage}
                onFocus={() => handleReadMessage()}
            />
        </div>
    </div>
};

export default ChatArea;
