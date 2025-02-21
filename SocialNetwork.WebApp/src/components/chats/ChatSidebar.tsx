import { FC, useEffect, useState } from "react";
import ChatUserItem from "./ChatUserItem";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Search } from "lucide-react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import SignalRConnector from '../../app/signalR/signalr-connection'
import "swiper/css";
SwiperCore.use([Navigation]);

import { ChatRoomResource } from "../../types/chatRoom";
import chatRoomService from "../../services/chatRoomService";
import useDebounce from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import LoadingIndicator from "../LoadingIndicator";
import messageService from "../../services/messageService";
import { Modal, Tabs, Tooltip } from "antd";
import PendingChatTab from "./PendingChatTab";
import CreateGroupChatModal from "../modals/CreateGroupChatModal";
import useModal from "../../hooks/useModal";

type ChatSidebarProps = {
    chatRoom: ChatRoomResource
}

const ChatSidebar: FC<ChatSidebarProps> = ({
    chatRoom
}) => {
    const [loading, setLoading] = useState(false)
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal();

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { user } = useSelector(selectAuth);
    const navigate = useNavigate();
    const [isChatRoomsLoaded, setIsChatRoomsLoaded] = useState(false);

    const getChatRoomById = async (chatRoomId: string): Promise<ChatRoomResource | undefined> => {
        const response = await chatRoomService.getChatRoomById(chatRoomId);
        if (response.isSuccess) {
            return response.data;
        }

        return undefined;
    }


    useEffect(() => {
        if (!isChatRoomsLoaded) return;
        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                console.log(message)
                const findChatRoom = chatRooms.find(c => c.id === message.chatRoomId);
                if (findChatRoom) {
                    setChatRooms(prev => {
                        const updatedList = [...prev];

                        const findChatRoomIndex = updatedList.findIndex(chatRoom => chatRoom.id === message.chatRoomId);

                        if (findChatRoomIndex !== -1) {
                            const chatRoom = updatedList.splice(findChatRoomIndex, 1)[0];

                            // Cập nhật trạng thái đã đọc nếu tin nhắn không phải do user gửi
                            if (user?.id !== message.senderId) {
                                chatRoom.isRead = false;
                            }

                            // Cập nhật nội dung tin nhắn cuối cùng
                            chatRoom.lastMessageDate = message.sentAt;
                            chatRoom.lastMessage = message.medias?.length
                                ? `${message.sender?.fullName ?? "Người dùng"} đã gửi ${message.medias.length} file`
                                : message.content;

                            // Đưa chatRoom lên đầu danh sách
                            updatedList.unshift(chatRoom);
                        }

                        return updatedList;
                    });

                } else {
                    getChatRoomById(message.chatRoomId)
                        .then(data => {
                            if (data) {
                                console.log(data)

                                setChatRooms(prev => {
                                    const findExisted = prev.find(m => m.id === data.id);
                                    if (!findExisted)
                                        return [data, ...prev]
                                    return prev
                                })
                            }
                        });
                }
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
        );

        return () => SignalRConnector.unsubscribeEvents()

    }, [isChatRoomsLoaded, chatRoom]);

    const fetchChatRooms = async () => {
        setLoading(true)
        const response = await chatRoomService.getAllChatRooms();
        setLoading(false)
        if (response.isSuccess) {
            setChatRooms(response.data);
            setIsChatRoomsLoaded(true);
        }
    }

    useEffect(() => {
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

    const handleReadMessage = async (chatRoomId: string) => {
        await messageService.readMessage(chatRoomId);
        navigate(`/chat/${chatRoomId}`)
    }

    return <div className="hidden lg:flex h-full bg-white lg:col-span-4 xl:col-span-3 flex-col gap-y-4 py-4 overflow-hidden border-r-[1px] border-gray-200">
        <div className="flex items-center justify-between px-4">
            <Link to='/' className="px-2 py-1 rounded-md bg-sky-100 text-primary text-xs">Quay lại</Link>
            <span className="text-xl font-semibold">Nhắn tin</span>
            <Tooltip title='Tạo phòng chat'>
                <button onClick={showModal}>
                    <Edit className="text-primary font-semibold" size={18} />
                </button>
            </Tooltip>
        </div>

        <Tabs
            className="px-4 h-full overflow-y-auto custom-scrollbar"
            items={[{
                key: "1",
                label: "Hội thoại",
                children: <div className="flex flex-col gap-y-4 h-full">
                    <div className="px-3 py-[6px] text-sm rounded-3xl bg-gray-100 flex items-center gap-x-2">
                        <Search size={16} className="text-gray-400" />
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="outline-none border-none w-full bg-gray-100" placeholder="Tìm kiếm" />
                    </div>

                    {loading ? <LoadingIndicator /> : <div className="flex flex-col gap-y-2 w-full h-full">
                        {chatRooms.map((item) => <ChatUserItem onClick={() => handleReadMessage(item.id)} isActive={item.id === chatRoom.id} key={item.id} chatRoom={item} />)}
                    </div>}
                </div>,
            },
            {
                key: "2",
                label: "Đang chờ",
                children: <PendingChatTab width="sidebar" />,
            },]}
        />

        <Modal
            style={{
                top: 20
            }}
            title={<p className="text-center font-bold text-lg">Tạo nhóm chat</p>}
            width='500px'
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            styles={{
                footer: {
                    display: 'none'
                }
            }}
        >
            <CreateGroupChatModal
                onSuccess={() => {
                    fetchChatRooms()
                    handleOk()
                }}
            />
        </Modal>
    </div>
};

export default ChatSidebar;
