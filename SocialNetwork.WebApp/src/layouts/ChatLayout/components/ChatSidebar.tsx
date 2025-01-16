import { FC, useEffect, useState } from "react";
import ChatUserItem from "../../../components/chats/ChatUserItem";
import { Link, useParams } from "react-router-dom";
import { Edit, Search } from "lucide-react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
SwiperCore.use([Navigation]);

import ChatAvatarStatus from "../../../components/chats/ChatAvatarStatus";
import { ChatRoomResource } from "../../../types/chatRoom";
import chatRoomService from "../../../services/chatRoomService";
import useDebounce from "../../../hooks/useDebounce";

const ChatSidebar: FC = () => {
    const { id } = useParams();
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);
    const [onlineChatRooms, setOnlineChatRooms] = useState<ChatRoomResource[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const response = await chatRoomService.getAllChatRooms();
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

    return <div className="h-full bg-white col-span-3 flex flex-col gap-y-4 py-4 overflow-hidden border-r-[1px] border-gray-200">
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
            >
                {onlineChatRooms.map(chatRoom => <SwiperSlide key={chatRoom.id}><ChatAvatarStatus chatRoom={chatRoom} /></SwiperSlide>)}
            </Swiper>

        </div>
        <div className="flex flex-col gap-y-2 px-4 w-full h-full overflow-y-auto custom-scrollbar">
            {chatRooms.map((chatRoom, index) => <ChatUserItem isActive={index === 0 && !id ? true : id === chatRoom.id} key={chatRoom.id} chatRoom={chatRoom} />)}
        </div>
    </div>
};

export default ChatSidebar;
