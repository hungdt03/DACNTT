import { Avatar, Tabs, TabsProps } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { Plus, X } from "lucide-react";
import { ChatRoomResource } from "../../../types/chatRoom";
import chatRoomService from "../../../services/chatRoomService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { add } from "../../../features/slices/chat-popup-slice";
import { Link } from "react-router-dom";
import friendRequestService from "../../../services/friendRequestService";
import { selectAuth } from "../../../features/slices/auth-slice";
import { FriendRequestResource } from "../../../types/friendRequest";
import { toast } from "react-toastify";

const MainRightSidebar: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector(selectAuth);
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);
    const [listFriendRequests, setListFriendRequests] = useState<FriendRequestResource[]>([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const response = await chatRoomService.getAllChatRooms();
            if (response.isSuccess) {
                setChatRooms(response.data);
            }
        };
        fetchChatRooms();

        loadFriendRequests();
    }, []);
    const loadFriendRequests = async () => {
        const response = await friendRequestService.getAllFriendRequestByUserId(user?.id ?? "");
        if (response.isSuccess) {
            setListFriendRequests(response.data);
        }
    };
    

    // // Dữ liệu giả định 
    const friendSuggestions = [
        { id: 4, name: "Phạm Văn C", avatar: images.user },
        { id: 5, name: "Hoàng Thị D", avatar: images.user },
        { id: 6, name: "Đặng Văn E", avatar: images.user },
    ];
    const handleCancelFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.cancelFriendRequest(requestId);
        if (response.isSuccess) {
            toast.success(response.message);
            loadFriendRequests();
        } else {
            toast.error(response.message);
        }
    };

    const handleAcceptFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.acceptFriendRequest(requestId);
        if (response.isSuccess) {
            toast.success(response.message);
            loadFriendRequests();
        } else {
            toast.error(response.message);
        }
    };

    // Nội dung của tab "Lời mời kết bạn"
    const FriendRequestsTab = () => (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                {listFriendRequests.map((request) => (
                   <div key={request.sender.id} className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                   <Link to={`/profile/${request.sender.id}`} className="flex items-center gap-x-3 cursor-pointer">
                       <Avatar size="default" src={request.sender.avatar} />
                       <span className="font-semibold text-sm">{request.sender.fullName}</span>
                   </Link>
                   <div className="flex items-center gap-x-2">
                       <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100" onClick={() => handleCancelFriendRequest(request.id)}>
                           <X size={16} className="text-gray-600" />
                       </button>
                       <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100"onClick={() => handleAcceptFriendRequest(request.id)}>
                           <Plus size={16} className="text-sky-500" />
                       </button>
                   </div>
               </div>                     
                ))}
            </div>
            <Link to='/friends/requests' className="text-center bg-sky-100 text-sky-500 py-[6px] rounded-md text-sm">Xem thêm</Link>
        </div>
    );

    // Nội dung của tab "Gợi ý kết bạn"
    const FriendSuggestionsTab = () => (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                {friendSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                        <div className="flex items-center gap-x-3">
                            <Avatar size="default" src={suggestion.avatar} />
                            <span className="font-semibold text-sm">{suggestion.name}</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
                                <X size={16} className="text-gray-600" />
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100">
                                <Plus size={16} className="text-sky-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Link to='/friends/suggests' className="text-center bg-sky-100 text-sky-500 py-[6px] rounded-md text-sm">Xem thêm</Link>
        </div>
    );

    // Cấu hình các tab
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Lời mời kết bạn",
            children: <FriendRequestsTab />,
        },
        {
            key: "2",
            label: "Gợi ý kết bạn",
            children: <FriendSuggestionsTab />,
        },
    ];

    return (
        <div className="xl:col-span-3 lg:col-span-4 hidden lg:flex flex-col gap-y-6 overflow-y-auto py-6 scrollbar-hide">
            <div className="p-4 rounded-md bg-white shadow">
                <Tabs defaultActiveKey="1" items={items} />
            </div>
            <div className="p-4 rounded-md flex flex-col gap-y-4 h-full overflow-y-auto scrollbar-hide">
                <span className="font-bold text-[17px] text-gray-700">Người liên hệ</span>
                <div className="flex flex-col gap-y-2 h-full">
                    {chatRooms
                        .filter((chatRoom) => chatRoom.isOnline)
                        .map((chatRoom) => (
                            <div
                                key={chatRoom.id}
                                onClick={() => dispatch(add(chatRoom))}
                                className="cursor-pointer flex items-center justify-between hover:bg-slate-200 px-2 py-2 rounded-md"
                            >
                                <div className="flex items-center gap-x-3">
                                    <div className="relative">
                                        {chatRoom.isPrivate && chatRoom.friend?.haveStory ? (
                                            <Link
                                                to={`/stories/${chatRoom.friend.id}`}
                                                className="inline-block rounded-full p-[1px] border-[2px] border-primary"
                                            >
                                                <Avatar size="default" src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} />
                                            </Link>
                                        ) : (
                                            <Avatar size="large" src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} />
                                        )}
                                        <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                                    </div>
                                    <span className="font-semibold text-sm">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default MainRightSidebar;