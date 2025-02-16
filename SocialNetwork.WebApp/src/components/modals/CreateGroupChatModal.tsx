import { Avatar, Button, Empty, message } from "antd";
import { FC, useEffect, useState } from "react";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import images from "../../assets";
import { FriendResource } from "../../types/friend";
import friendService from "../../services/friendService";
import { CheckIcon, Search } from "lucide-react";
import chatRoomService from "../../services/chatRoomService";
import { inititalValues } from "../../utils/pagination";
import { useElementInfinityScroll } from "../../hooks/useElementInfinityScroll";
import LoadingIndicator from "../LoadingIndicator";
import useDebounce from "../../hooks/useDebounce";

export type CreateChatRoomRequest = {
    memberIds: string[];
    groupName: string;
}

type CreateGroupChatModalProps = {
    onSuccess?: () => void
}

const CreateGroupChatModal: FC<CreateGroupChatModalProps> = ({
    onSuccess
}) => {
    const [friends, setFriends] = useState<FriendResource[]>([]);
    const [addFriends, setAddFriends] = useState<FriendResource[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [pagination, setPagination] = useState(inititalValues);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 300);

    const fetchFriends = async (query: string, page: number, size: number, reset: boolean = false) => {
        setLoading(true)
        const response = await friendService.getAllConnectFriends(query, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setFriends(prev => {
                if (reset) return response.data
                const existingIds = new Set(prev.map(item => item.id));
                const news = response.data.filter(item => !existingIds.has(item.id));
                return [...prev, ...news];
            });
            setPagination(response.pagination)
        }
    }

    const fetchNextPage = () => {
        if (!pagination.hasMore || loading) return;
        fetchFriends(debouncedValue, pagination.page + 1, pagination.size)
    }

    useElementInfinityScroll({
        elementId: "group-layout",
        onLoadMore: fetchNextPage,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });

    const handleAddFriend = (friend: FriendResource) => {
        const isExisted = addFriends.some(f => f.id === friend.id);
        if (!isExisted) {
            setAddFriends(prev => [...prev, friend])
        }
    }

    const handleRemove = (friend: FriendResource) => {
        const isExisted = addFriends.some(f => f.id === friend.id);
        if (isExisted) {
            setAddFriends(prev => prev.filter(fr => fr.id !== friend.id))
        }
    }

    const handleCreateChatRoom = async () => {
        const payload: CreateChatRoomRequest = {
            memberIds: addFriends.map(fr => fr.id),
            groupName: groupName
        }

        const response = await chatRoomService.createChatRoom(payload);
        if (response.isSuccess) {
            message.success(response.message);
            setAddFriends([]);
            setGroupName('');
            onSuccess?.()
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        fetchFriends(debouncedValue, pagination.page, pagination.size, true)
    }, [debouncedValue])

    return <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
            <label htmlFor="name-group">Tên nhóm chat</label>
            <div className="flex items-center gap-x-3">
                <input value={groupName} onChange={e => setGroupName(e.target.value)} id="name-group" className="flex-1 px-2 py-1 outline-none border-[1px] border-primary rounded-md" placeholder="Tên nhóm chat..." />
                {addFriends.length > 1 && groupName.trim().length > 0 && <Button onClick={handleCreateChatRoom} type="primary" icon={<CheckIcon size={14} />}>Tạo nhóm</Button>}
            </div>
        </div>


        {addFriends.length > 0 && <div className="flex flex-col gap-y-2">
            <span className="font-semibold">Đã thêm</span>
            <div className="flex items-center gap-2 flex-wrap w-full p-2 rounded-md border-[1px] border-gray-200 max-h-[100px] overflow-y-auto custom-scrollbar">
                {addFriends.map(friend => <button key={friend.id} className="flex gap-x-2 items-center p-1 px-2 rounded-md bg-sky-100 text-primary font-semibold">
                    <span>{friend.fullName}</span>
                    <CloseOutlined onClick={() => handleRemove(friend)} className="text-xs font-bold" />
                </button>)}
            </div>
        </div>}

        <div className="flex flex-col gap-y-2">
            <div className="px-3 py-1 bg-gray-100 flex items-center gap-x-1 rounded-3xl overflow-hidden">
                <Search size={16} className="text-gray-500" />
                <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm bạn bè theo tên" className="bg-gray-100 outline-none px-2 py-1 w-full h-full" />
            </div>


            <span className="font-semibold">Những người đã kết nối</span>
            <div className="flex flex-col gap-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {friends.map(friend => <div key={friend.id} className="flex items-center justify-between px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <div className="cursor-pointer flex items-center gap-x-3">
                        <Avatar size='large' src={friend.avatar ?? images.user} />
                        <span>{friend.fullName}</span>
                    </div>

                    {addFriends.some(fr => fr.id === friend.id) ? <Button onClick={() => handleRemove(friend)} icon={<CloseOutlined />} danger type="primary">Hủy bỏ</Button> : <Button onClick={() => handleAddFriend(friend)} icon={<PlusOutlined />} type="primary">Thêm</Button>}
                </div>)}

                {friends.length === 0 && !loading && <Empty description='Bạn chưa có bạn bè nào' />}
                {loading && <LoadingIndicator />}
            </div>
        </div>
    </div>
};

export default CreateGroupChatModal;
