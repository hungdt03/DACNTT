import { Avatar, Empty, message, Tabs, TabsProps, Tooltip } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { Check, CircleMinus, Plus, X } from "lucide-react";
import { ChatRoomResource } from "../../../types/chatRoom";
import chatRoomService from "../../../services/chatRoomService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { add } from "../../../features/slices/chat-popup-slice";
import { Link } from "react-router-dom";
import friendRequestService from "../../../services/friendRequestService";
import { selectAuth } from "../../../features/slices/auth-slice";
import { FriendRequestResource } from "../../../types/friendRequest";
import { SuggestedFriendResource } from "../../../types/suggested-friend";
import friendService from "../../../services/friendService";
import LoadingIndicator from "../../../components/LoadingIndicator";
import ChatUserSkeleton from "../../../components/skeletons/ChatUserSkeleton";

const MainRightSidebar: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector(selectAuth);
    const [chatRooms, setChatRooms] = useState<ChatRoomResource[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchChatRooms = async () => {
            setLoading(true)
            const response = await chatRoomService.getAllChatRooms();
            setLoading(false)
            if (response.isSuccess) {
                setChatRooms(response.data);
            }
        };
        fetchChatRooms();
    }, []);

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Lời mời kết bạn",
            children: user ? <FriendRequestsTab userId={user.id} /> : <LoadingIndicator />,
        },
        {
            key: "2",
            label: "Gợi ý kết bạn",
            children: user ? <FriendSuggestionsTab userId={user.id} /> : <LoadingIndicator />,
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
                    {!loading && chatRooms
                        .filter((chatRoom) => chatRoom.isOnline && (!chatRoom.isPrivate || (chatRoom.isPrivate && chatRoom.friend?.isShowStatus)) )
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
                                                className="inline-block rounded-full p-[1px] border-[2px] border-[#27a1aa]"
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

                {loading && <ChatUserSkeleton />}
            </div>
        </div>
    );
};

export default MainRightSidebar;


type FriendRequestsTabProps = {
    userId: string;
}

const FriendRequestsTab: FC<FriendRequestsTabProps> = ({
    userId
}) => {
    const [listFriendRequests, setListFriendRequests] = useState<FriendRequestResource[]>([]);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadFriendRequests();
    }, [userId])

    const loadFriendRequests = async () => {
        setLoading(true)
        const response = await friendRequestService.getAllFriendRequestByUserId(1, 6);
        setLoading(false)
        if (response.isSuccess) {
            setListFriendRequests(response.data);
            setHasNext(response.pagination.hasMore)
        }
    };

    const handleCancelFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.cancelFriendRequest(requestId);
        if (response.isSuccess) {
            message.success(response.message);
            loadFriendRequests();
        } else {
            message.error(response.message);
        }
    };

    const handleAcceptFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.acceptFriendRequest(requestId);
        if (response.isSuccess) {
            message.success(response.message);
            loadFriendRequests();
        } else {
            message.error(response.message);
        }
    };

    return <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
            {listFriendRequests.map((request) => (
                <div key={request.sender.id} className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <Link to={`/profile/${request.sender.id}`} className="flex items-center gap-x-3 cursor-pointer hover:text-black">
                        <Avatar size="default" src={request.sender.avatar} />
                        <span className="font-semibold text-sm">{request.sender.fullName}</span>
                    </Link>
                    <div className="flex items-center gap-x-2">
                        <Tooltip title='Gỡ lời mời'>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100" onClick={() => handleCancelFriendRequest(request.id)}>
                                <CircleMinus size={16} className="text-red-600" />
                            </button>
                        </Tooltip>
                        <Tooltip title='Chấp nhận'>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100" onClick={() => handleAcceptFriendRequest(request.id)}>
                                <Check size={16} className="text-sky-500" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            ))}

            {!loading && listFriendRequests.length === 0 && <Empty description='Không có lời mời kết bạn nào' />}
            {loading && <LoadingIndicator />}
        </div>
        {!loading && hasNext && <Link to='/friends/requests' className="text-center bg-sky-100 text-sky-500 py-[6px] rounded-md text-sm">Xem thêm</Link>}
    </div>
}


type FriendSuggestionsTabProps = {
    userId: string;
}

const FriendSuggestionsTab: FC<FriendSuggestionsTabProps> = ({
    userId
}) => {
    const [friendSuggestions, setFriendSuggestions] = useState<SuggestedFriendResource[]>([]);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false)

    const fetchSuggestedFriends = async () => {
        setLoading(true)
        const response = await friendService.getSuggestedFriends(1, 6);
        setLoading(false)
        if (response.isSuccess) {
            setHasNext(response.pagination.hasMore);
            setFriendSuggestions(response.data)
        }
    }

    const handleSendRequest = async (userId: string) => {
        const response = await friendRequestService.createFriendRequest(userId);
        if (response.isSuccess) {
            message.success(response.message);
            fetchSuggestedFriends()
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        fetchSuggestedFriends()
    }, [userId])

    return <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
            {friendSuggestions.map((suggestion) => (
                <div key={suggestion.user.id} className="flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md">
                    <div className="flex items-center gap-x-3">
                        <Avatar size="default" src={suggestion.user.avatar} />
                        <Link to={`/profile/${suggestion.user.id}`} className="hover:underline hover:text-black font-semibold text-sm">{suggestion.user.fullName}</Link>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Tooltip title='Thêm bạn bè'>
                            <button onClick={() => handleSendRequest(suggestion.user.id)} className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100">
                                <Plus size={16} className="text-sky-500" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            ))}

            {!loading && friendSuggestions.length === 0 && <Empty description='Không có gợi ý kết bạn nào phù hợp' />}

            {loading && <LoadingIndicator />}
        </div>
        {!loading && hasNext && <Link to='/friends/suggests' className="text-center bg-sky-100 text-sky-500 py-[6px] rounded-md text-sm">Xem thêm</Link>}
    </div>
}
