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
import { Tooltip, UploadFile } from "antd";
import { imageTypes, videoTypes } from "../../utils/file";
import { MediaType } from "../../constants/media";

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
    const { sendMessage, events } = SignalRConnector();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<MessageResource[]>([])
    const { user } = useSelector(selectAuth)

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
        events((message) => {
            if (message.chatRoomId === room.id) {
                setPendingMessages((prev) =>
                    prev.filter((m) => m.sentAt.getTime() !== new Date(message.sentAt).getTime())
                );
                setMessages((prev) => [...prev, message]);
            }
        });
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

        if ((msgPayload.images && msgPayload.images.length > 0 )|| (msgPayload.videos && msgPayload.videos.length > 0)) {
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
            sendMessage(msgPayload)
        }

        setMsgPayload({
            ...msgPayload,
            content: '',
            images: [],
            videos: []
        })

    }

    return <div className="w-[300px] z-[2000] h-[450px] relative bg-white rounded-t-xl overflow-hidden shadow-md">
        <div className="bg-sky-500 text-white absolute top-0 left-0 right-0 shadow-md flex items-center justify-between border-[1px] border-gray-200 p-[2px]">
            <div className="flex items-center gap-x-2 rounded-md p-1">
                <div className="relative">
                    <img
                        src={room.friend?.avatar ?? images.user}
                        alt="Avatar"
                        className="w-[40px] h-[40px] rounded-full"
                    />
                    <span className="absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full border-2 border-white bg-green-500"></span>
                </div>

                <div className="flex flex-col">
                    <b className="text-sm">{room.friend?.fullName}</b>
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
            {[...messages, ...pendingMessages].map(message => <Message key={message.id} message={message} isMe={message.senderId === user?.id} />)}
            <div ref={messagesEndRef}></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white shadow border-t-[1px] border-gray-100">
            <BoxSendMessage
                value={msgPayload.content}
                onChange={handleBoxChange}
                onSubmit={handleSendMessage}
            />

        </div>
    </div >

};

export default ChatPopup;
