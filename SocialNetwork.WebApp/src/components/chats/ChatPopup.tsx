import { FC, useEffect, useRef, useState } from "react";
import { CloseOutlined, MinusOutlined } from '@ant-design/icons'
import images from "../../assets";
import Message from "./messages/Message";
import { ChatRoomResource } from "../../types/chatRoom";
import SignalRConnector from '../../app/signalR/signalr-connection'
import { MessageResource } from "../../types/message";
import messageService from "../../services/messageService";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import BoxSendMessage from "./BoxSendMessage";
import { Tooltip, UploadFile } from "antd";
import { imageTypes, videoTypes } from "../../utils/file";

export type MessageRequest = {
    content: string;
    chatRoomName: string;
    images?: UploadFile[]
    videos?: UploadFile[]
}

type ChatPopupProps = {
    room: ChatRoomResource;
    onClose?: () => void;
    onMinimize?: () => void;
}

const ChatPopup: FC<ChatPopupProps> = ({
    room,
    onClose,
    onMinimize
}) => {
    const { sendMessage, events } = SignalRConnector();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<MessageResource[]>([])
    const { user } = useSelector(selectAuth)

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

        events((message) => setMessages(prev => [...prev, message]));

    }, []);

    useEffect(() => {
        if (messagesEndRef.current)
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])


    const handleUploadFiles = (files: UploadFile[]) => {
        const imageFiles = files
            .filter(file => imageTypes.includes(file.type as string) || (file.type as string).includes("image/"))

        const videoFiles = files
            .filter(file => videoTypes.includes(file.type as string) || (file.type as string).includes("video/"))

        setMsgPayload(prev => ({
            ...prev,
            images: imageFiles,
            videos: videoFiles
        }));

    }

    const handleSendMessage = async () => {
        if (msgPayload.images || msgPayload.videos) {
            const formData = new FormData();

            msgPayload?.images?.forEach(file => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj, file.name);
                }
            });

            msgPayload?.videos?.forEach(file => {
                if (file.originFileObj) {
                    formData.append('videos', file.originFileObj, file.name);
                }
            });

            formData.append('content', msgPayload.content);
            formData.append('chatRoomName', msgPayload.chatRoomName);

            const response = await messageService.sendMessage(formData);
            console.log(response)
        } else {
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
            {messages.map(message => <Message key={message.id} message={message} isMe={message.senderId === user?.id} />)}

            <div ref={messagesEndRef}></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white shadow border-t-[1px] border-gray-100">
            <BoxSendMessage
                value={msgPayload.content}
                onContentChange={newContent => setMsgPayload({
                    ...msgPayload,
                    content: newContent
                })}
                onFileChange={handleUploadFiles}
                onSubmit={handleSendMessage}
            />
            {/* <div className="w-full py-3 px-2"> */}

            {/* <div className="flex items-center gap-x-1">
                    {/* <div className="flex-shrink-0">
                        <button>
                            <img alt="Ảnh" className="w-6 h-6" src={images.photo} />
                        </button>
                    </div> */}

            {/* <div className="bg-gray-100 px-1 py-1 rounded-3xl w-full flex justify-between">
                        <input value={msgPayload.content} onChange={e => setMsgPayload({
                            ...msgPayload,
                            content: e.target.value
                        })} className="px-2 flex-1 text-sm outline-none border-none bg-gray-100" placeholder="Nhập tin nhắn" />
                        <button onClick={handleSendMessage} disabled={!msgPayload.content.trim()} className="w-8 h-8 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
                            <SendHorizonal size={16} className="text-sky-600" />
                        </button>
                    </div> */}


            {/* </div>  */}
            {/* </div> */}
        </div>
    </div >

};

export default ChatPopup;
