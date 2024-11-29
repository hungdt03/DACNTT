import { FC } from "react";
import ChatUserItem from "../../../components/chats/ChatUserItem";
import { Link } from "react-router-dom";
import { Edit, Search } from "lucide-react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
SwiperCore.use([Navigation]);

import ChatAvatarStatus from "../../../components/chats/ChatAvatarStatus";

const ChatSidebar: FC = () => {
    return <div className="h-full bg-white col-span-3 flex flex-col gap-y-4 py-4 overflow-hidden border-[1px] border-sky-300 rounded-xl">
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
                <input className="outline-none border-none w-full bg-gray-100" placeholder="Tìm kiếm" />
            </div>
        </div>
        <div className="flex items-center gap-y-2 pl-4">
            <Swiper
                className="w-full"
                slidesPerView={5.5}
                spaceBetween={4}
                modules={[Navigation]}
            >
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
                <SwiperSlide><ChatAvatarStatus /></SwiperSlide>
            </Swiper>

        </div>
        <div className="flex flex-col gap-y-2 px-4 w-full h-full overflow-y-auto custom-scrollbar">
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
            <ChatUserItem />
        </div>
    </div>
};

export default ChatSidebar;
