import { Avatar, Empty, Modal } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Edit, Search } from "lucide-react";
import { ChatRoomResource } from "../../types/chatRoom";
import chatRoomService from "../../services/chatRoomService";
import { formatTime } from "../../utils/date";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { add, setChatRoomRead } from "../../features/slices/chat-popup-slice";
import useModal from "../../hooks/useModal";
import CreateGroupChatModal from "../modals/CreateGroupChatModal";
import cn from "../../utils/cn";
import ChatUserSkeleton from "../skeletons/ChatUserSkeleton";
import messageService from "../../services/messageService";
import SignalRConnector from '../../app/signalR/signalr-connection'
import useDebounce from "../../hooks/useDebounce";
import { selectAuth } from "../../features/slices/auth-slice";


type ChatRoomTabProps = {
    onCountChatRoom: (count: number) => void
}

const ChatRoomTab: FC<ChatRoomTabProps> = ({
    onCountChatRoom
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { user } = useSelector(selectAuth)

    const { handleCancel, handleOk, isModalOpen, showModal } = useModal();

    const fetchChatRooms = async () => {
        setLoading(true)
        const response = await chatRoomService.getAllChatRooms();
        console.log(response)
        setLoading(false)
        onCountChatRoom(response.data.filter(chatRoom => !chatRoom.isRead).length)
        if (response.isSuccess) {
            setChatRooms(response.data)
        }
    }

    useEffect(() => { 

        fetchChatRooms()

        SignalRConnector.events(
            // ON MESSAGE RECEIVE
            (message) => {
                setChatRooms(prev => {
                    const updatedChatRooms = [...prev]
                    const findIndex = updatedChatRooms.findIndex(chatRoom => chatRoom.id === message.chatRoomId);
                    if (findIndex !== -1) {
                        updatedChatRooms[findIndex].lastMessage = message.content ? message.content : `${message.sender.fullName} đã gửi ${message.medias.length} tập tin`;
                        updatedChatRooms[findIndex].lastMessageDate = message.sentAt;
                        updatedChatRooms[findIndex].isRead = message.senderId === user?.id;
                    }

                    return updatedChatRooms
                })
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        );
    }, []);

    useEffect(() => {
        const searchChatRoom = async () => {
            setLoading(true)
            const response = await chatRoomService.searchChatRoomByName(debouncedSearchTerm);
            setLoading(false)
            if (response.isSuccess) {
                setChatRooms(response.data);
            }
        };

        debouncedSearchTerm.length > 1 && searchChatRoom();
    }, [debouncedSearchTerm]);


    const readMessage = async (chatRoom: ChatRoomResource) => {
        await messageService.readMessage(chatRoom.id);
        dispatch(add(chatRoom));
        dispatch(setChatRoomRead(chatRoom.id));
    }

    const handleSelectChat = async (chatRoom: ChatRoomResource) => {
        await readMessage(chatRoom)

        setChatRooms(prev => {
            const updateList = [...prev]
            const findIndex = updateList.findIndex(item => item.id === chatRoom.id);
            if (findIndex !== -1) {
                updateList[findIndex] = {
                    ...updateList[findIndex],
                    isRead: true
                }
            }
            return updateList;
        })
    }

    return <>
        <div className="flex flex-col gap-y-3 w-[380px]">
            <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700 px-1 text-[15px]">Đoạn chat</span>
                <button onClick={showModal} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                    <Edit size={14} />
                </button>
            </div>
            <div className="flex flex-1 items-center gap-x-2 px-3 py-2 rounded-3xl bg-gray-100">
                <Search size={16} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="outline-none border-none bg-gray-100 w-full" placeholder="Tìm kiếm cuộc hội thoại" />
            </div>
            <div className="flex flex-col gap-y-2 p-2 max-h-[70vh] overflow-y-auto custom-scrollbar ww-full">
                {loading ? <ChatUserSkeleton />
                    : chatRooms.map(chatRoom => <div onClick={() => handleSelectChat(chatRoom)} key={chatRoom.id} className="relative flex items-center gap-x-3 py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="relative">
                            <Avatar className="w-12 flex-shrink-0 h-12 object-cover" src={chatRoom.friend?.avatar ?? images.group} />
                            {chatRoom.isOnline && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>}
                        </div>
                        <div className="flex flex-col items-start gap-y-1">
                            <span className="font-semibold text-[16px] text-sm">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                            <div className="flex items-center gap-x-3">
                                <p
                                    className={cn("text-[12px] max-w-[120px] truncate overflow-hidden text-ellipsis whitespace-nowrap", !chatRoom.isRead ? 'text-black font-bold' : 'text-gray-500 font-normal')}>
                                    {chatRoom.lastMessage}
                                </p>
                                <span className="text-xs text-gray-400">{formatTime(new Date(chatRoom.lastMessageDate))}</span>
                            </div>
                        </div>

                        {!chatRoom.isRead && <div className="bg-primary w-2 h-2 rounded-full absolute top-1/2 -translate-y-1/2 right-2"></div>}
                    </div>)}

                {chatRooms.length === 0 && !loading && (
                    <Empty description="Chưa có đoạn chat nào" />
                )}
            </div>
        </div>

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
    </>
};

export default ChatRoomTab;
