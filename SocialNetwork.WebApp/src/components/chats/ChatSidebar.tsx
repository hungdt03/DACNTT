import { FC, useEffect, useState } from "react";
import ChatUserItem from "./ChatUserItem";
import { Link } from "react-router-dom";
import { Edit, Search } from "lucide-react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SignalRConnector from '../../app/signalR/signalr-connection'
import "swiper/css";
SwiperCore.use([Navigation]);

import ChatAvatarStatus from "./ChatAvatarStatus";
import { ChatRoomResource } from "../../types/chatRoom";
import chatRoomService from "../../services/chatRoomService";
import useDebounce from "../../hooks/useDebounce";
import ChatUserSkeleton from "../skeletons/ChatUserSkeleton";
import ChatSwiperSkeleton from "../skeletons/ChatSwiperSkeleton";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

type ChatSidebarProps = {
    chatRoom: ChatRoomResource
}

const ChatSidebar: FC<ChatSidebarProps> = ({
    chatRoom
}) => {
    const [loading, setLoading] = useState(false)
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);
    const [onlineChatRooms, setOnlineChatRooms] = useState<ChatRoomResource[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { user } = useSelector(selectAuth);

    useEffect(() => {
        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                console.log('Receive message in chat sidebar')
                setChatRooms(prev => {
                    const updatedList = [...prev];

                    const findChatRoomIndex = updatedList.findIndex(chatRoom => chatRoom.id === message.chatRoomId);

                    if (findChatRoomIndex !== -1) {
                        if (user?.id !== message.senderId) {
                            updatedList[findChatRoomIndex].isRead = false;
                        }

                        updatedList[findChatRoomIndex].lastMessageDate = message.sentAt

                        if (message.medias.length > 0) {
                            updatedList[findChatRoomIndex].lastMessage = `${message.sender.fullName} đã gửi ${message.medias.length} file`
                        } else
                            updatedList[findChatRoomIndex].lastMessage = message.content
                    }

                    return updatedList;
                })

            },
            (message) => {
                setChatRooms(prev => {
                    const updatedList = [...prev];

                    const findChatRoomIndex = updatedList.findIndex(chatRoom => chatRoom.id === message.chatRoomId);

                    if (findChatRoomIndex !== -1 && user?.id !== message.senderId) {
                        updatedList[findChatRoomIndex].isRead = true;
                    }
                    return updatedList;
                })
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        );

    }, [chatRoom]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            setLoading(true)
            const response = await chatRoomService.getAllChatRooms();
            setLoading(false)
            if (response.isSuccess) {
                setChatRooms(response.data);
                setOnlineChatRooms(response.data.filter(item => item.isOnline))
            }
        }

        fetchChatRooms();
    }, [])

    useEffect(() => {
        const searchChatRoom = async () => {
            const response = await chatRoomService.searchChatRoomByName(debouncedSearchTerm);
            if (response.isSuccess) {
                setChatRooms(response.data);
            }
        };

        searchChatRoom();
    }, [debouncedSearchTerm]);

    return <div className="hidden lg:flex h-full bg-white lg:col-span-4 xl:col-span-3 flex-col gap-y-4 py-4 overflow-hidden border-r-[1px] border-gray-200">
        <div className="flex items-center justify-between px-4">
            <Link to='/' className="px-2 py-1 rounded-md bg-sky-100 text-primary text-xs">Quay lại</Link>
            <span className="text-xl font-semibold">Nhắn tin</span>
            <button>
                <Edit className="text-primary font-semibold" size={18} />
            </button>
        </div>

        <div className="px-4">
            <div className="px-3 py-[6px] text-sm rounded-3xl bg-gray-100 flex items-center gap-x-2">
                <Search size={16} className="text-gray-400" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="outline-none border-none w-full bg-gray-100" placeholder="Tìm kiếm" />
            </div>
        </div>
        <div className="flex items-center gap-y-2 pl-4">
            <Swiper
                className="w-full"
                slidesPerView={5.5}
                spaceBetween={4}
                modules={[Navigation]}
                breakpoints={{
                    1280: { // XL (>= 1280px)
                        slidesPerView: 5.5, // Hiển thị 5 item
                    },
                    1024: { // LG (>= 1024px)
                        slidesPerView: 4.5, // Hiển thị 4 item
                    },
                  
                }}
            >
                {loading ? <ChatSwiperSkeleton /> : onlineChatRooms.map(chatRoom => <SwiperSlide key={chatRoom.id}><ChatAvatarStatus chatRoom={chatRoom} /></SwiperSlide>)}
            </Swiper>

        </div>
        {loading ? <ChatUserSkeleton /> : <div className="flex flex-col gap-y-2 px-4 w-full h-full overflow-y-auto custom-scrollbar">
            {chatRooms.map((item) => <ChatUserItem isActive={item.id === chatRoom.id} key={item.id} chatRoom={item} />)}
        </div>}
    </div>
};

export default ChatSidebar;
