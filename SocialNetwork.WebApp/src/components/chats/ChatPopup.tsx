import { FC, useEffect, useRef, useState } from "react";
import { CloseOutlined, MinusOutlined, PhoneOutlined } from '@ant-design/icons'
import images from "../../assets";
import Message from "./messages/Message";
import { ChatRoomResource } from "../../types/chatRoom";
import SignalRConnector from '../../app/signalR/signalr-connection'
import { MessageMediaResource, MessageResource } from "../../types/message";
import messageService from "../../services/messageService";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import BoxSendMessage, { BoxMessageType } from "./BoxSendMessage";
import { Tooltip, UploadFile, message } from "antd";
import { imageTypes, videoTypes } from "../../utils/file";
import { MediaType } from "../../enums/media";

export type MessageRequest = {
    content: string;
    chatRoomName: string;
    sentAt?: Date;
    images?: UploadFile[]
    videos?: UploadFile[]
}

type ChatPopupProps = {
    room: ChatRoomResource;
    onClose?: () => void;
    onMinimize?: () => void;
    onCalling?: () => void;
}

const ChatPopup: FC<ChatPopupProps> = ({
    room,
    onClose,
    onMinimize,
    onCalling
}) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<MessageResource[]>([])
    const { user } = useSelector(selectAuth);

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [typing, setTyping] = useState<string>('');
    const [pendingMessages, setPendingMessages] = useState<MessageResource[]>([]);
    const [msgPayload, setMsgPayload] = useState<MessageRequest>({
        content: '',
        chatRoomName: room.uniqueName
    });

    const fetchMessages = async () => {
        const response = await messageService.getAllMessagesByChatRoomId(room.id);
        if (response.isSuccess) {
            setMessages(response.data)
        }
    }

    useEffect(() => {
        fetchMessages()

        SignalRConnector.events (
            // ON MESSAGE RECEIVE
            (message) => {
                if (message.chatRoomId === room.id) {
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
            },
            // ON READ STATUS RECEIVE
            (message, userId) => {
                if (message.chatRoomId === room.id) {
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
            undefined,
            undefined,
            undefined,
        );
       
    }, []);

    useEffect(() => {
        if (messagesEndRef.current)
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
            } catch(error) {
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
        const length = messages.length;
        if (messages[length - 1] && messages[length - 1].senderId !== user?.id) {
            const response = await messageService.readMessage(messages[length - 1].id);
            if (!response.isSuccess) {
                message.warning(response.message)
            } else {
                console.log(response)
            }
        }
    }

    return <div className="w-[300px] z-[100] h-[450px] relative bg-white rounded-t-xl overflow-hidden shadow-md">
        <div className="bg-sky-500 text-white absolute top-0 left-0 right-0 shadow-md flex items-center justify-between border-[1px] border-gray-200 p-[2px]">
            <div className="flex items-center gap-x-2 rounded-md p-1">
                <div className="relative">
                    <img
                        src={room.friend?.avatar ?? images.group}
                        alt="Avatar"
                        className="w-[40px] h-[40px] rounded-full"
                    />
                    <span className="absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full border-2 border-white bg-green-500"></span>
                </div>

                <div className="flex flex-col">
                    <b className="text-sm">{room.isPrivate ? room.friend?.fullName : room.name}</b>
                    <p className="text-[13px]">Đang hoạt động</p>
                </div>
            </div>

            <div className="flex gap-x-1 items-center">
                <Tooltip title="Gọi điện">
                    <button onClick={() => onCalling?.()} className="p-2 bg-transparent border-none">
                        <PhoneOutlined className="rotate-90" />
                    </button>
                </Tooltip>
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

        <div className="overflow-y-auto absolute left-0 right-0 top-14 bottom-14 px-2 py-3 scrollbar-w-2 scrollbar-h-4 custom-scrollbar flex flex-col gap-y-3">
            {[...messages, ...pendingMessages].map(message => <Message chatRoom={room} key={message.id} message={message} isMe={message.senderId === user?.id} />)}
            <div ref={messagesEndRef}></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
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
    </div >

};

export default ChatPopup;
