import { Avatar, Modal } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Edit, Search } from "lucide-react";
import { ChatRoomResource } from "../../types/chatRoom";
import chatRoomService from "../../services/chatRoomService";
import { formatTime } from "../../utils/date";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { add } from "../../features/slices/chat-popup-slice";
import useModal from "../../hooks/useModal";
import CreateGroupChatModal from "../modals/CreateGroupChatModal";
import cn from "../../utils/cn";

const MessengerDialog: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);

    const { handleCancel, handleOk, isModalOpen, showModal } = useModal()

    useEffect(() => {
        const fetchChatRooms = async () => {
            const response = await chatRoomService.getAllChatRooms();
            if (response.isSuccess) {
                console.log(response)
                setChatRooms(response.data)
            }
        }

        fetchChatRooms()
    }, []);

    return <>
        <div className="flex flex-col gap-y-3 w-[330px]">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-500 px-1 text-lg">Đoạn chat</span>
                <button onClick={showModal} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                    <Edit size={14} />
                </button>
            </div>
            <div className="flex flex-1 items-center gap-x-2 px-3 py-2 rounded-3xl bg-gray-100">
                <Search size={16} />
                <input className="outline-none border-none bg-gray-100 w-full" placeholder="Tìm kiếm cuộc hội thoại" />
            </div>
            <div className="flex flex-col gap-y-2 p-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {chatRooms.map(chatRoom => <div onClick={() => dispatch(add(chatRoom))} key={chatRoom.id} className="relative flex items-center gap-x-3 py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer">
                    <div className="relative">
                        <Avatar className="w-12 flex-shrink-0 h-12 object-cover" src={chatRoom.friend?.avatar ?? images.group} />
                        <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                    </div>
                    <div className="flex flex-col items-start gap-y-1">
                        <span className="font-semibold text-[16px] text-sm">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                        <div className="flex items-center gap-x-3">
                            <p
                                className={cn("text-[12px] text-gray-500 max-w-[120px] truncate overflow-hidden text-ellipsis whitespace-nowrap", 'text-black font-semibold')}>
                                {chatRoom.lastMessage}
                            </p>
                            <span className="text-xs text-gray-400">{formatTime(new Date(chatRoom.lastMessageDate))}</span>
                        </div>
                    </div>

                    <div className="bg-primary w-2 h-2 rounded-full absolute top-1/2 -translate-y-1/2 right-2"></div>
                </div>)}
            </div>
        </div>

        <Modal
            style={{
                top: 20
            }}
            title={<p className="text-center font-semibold text-xl">Tạo nhóm chat</p>}
            width='500px'
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
         
        >
            <CreateGroupChatModal
                onSuccess={handleOk}
            />
        </Modal>
    </>
};

export default MessengerDialog;
