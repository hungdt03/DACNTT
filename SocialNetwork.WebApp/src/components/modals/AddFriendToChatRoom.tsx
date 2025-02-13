import { FC, useEffect, useState } from "react";
import { FriendResource } from "../../types/friend";
import { inititalValues } from "../../utils/pagination";
import { useElementInfinityScroll } from "../../hooks/useElementInfinityScroll";
import friendService from "../../services/friendService";
import { Avatar, Button, Empty, message } from "antd";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import images from "../../assets";
import LoadingIndicator from "../LoadingIndicator";
import { CheckIcon } from "lucide-react";
import chatRoomService from "../../services/chatRoomService";

type AddFriendToChatRoomProps = {
    onSuccess: () => void;
    chatRoomId: string;
}

const AddFriendToChatRoom: FC<AddFriendToChatRoomProps> = ({
    chatRoomId,
    onSuccess
}) => {
    const [friends, setFriends] = useState<FriendResource[]>([]);
    const [addFriends, setAddFriends] = useState<FriendResource[]>([]);
    const [pagination, setPagination] = useState(inititalValues);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false)

    const fetchFriends = async (page: number, size: number) => {
        setLoading(true)
        const response = await friendService.getAllConnectFriends(page, size);
        setLoading(false)
        if (response.isSuccess) {
            setFriends(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const news = response.data.filter(item => !existingIds.has(item.id));
                return [...prev, ...news];
            });
            setPagination(response.pagination)
        }
    }

    const fetchNextPage = () => {
        if (!pagination.hasMore || loading) return;
        fetchFriends(pagination.page + 1, pagination.size)
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

    const handleAddFriendToChatRoom = async () => {
        const userIds = addFriends.map(fr => fr.id)
        setSubmitLoading(true)
        const response = await chatRoomService.addMember(chatRoomId, userIds);
        setSubmitLoading(false)
        if(response.isSuccess) {
            message.success(response.message);
            setFriends([])
            setAddFriends([])
            onSuccess()
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        fetchFriends(pagination.page, pagination.size)
    }, [])

    return <div className="flex flex-col gap-y-4">

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
            <span className="font-semibold">Bạn bè</span>
            <div className="flex flex-col gap-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {friends.map(friend => <div key={friend.id} className="flex items-center justify-between px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <div className="cursor-pointer flex items-center gap-x-3">
                        <Avatar size='large' src={friend.avatar ?? images.user} />
                        <span>{friend.fullName}</span>
                    </div>

                    {addFriends.some(fr => fr.id === friend.id) ? <Button onClick={() => handleRemove(friend)} icon={<CloseOutlined />} size="small" danger type="primary">Hủy bỏ</Button> : <Button size="small" onClick={() => handleAddFriend(friend)} icon={<PlusOutlined />} type="primary">Chọn</Button>}
                </div>)}

                {friends.length === 0 && !loading && <Empty description='Bạn chưa có bạn bè nào' />}
                {loading && <LoadingIndicator />}
            </div>
        </div>

        <div className="flex justify-end">
            {addFriends.length > 0 && <Button loading={submitLoading} onClick={handleAddFriendToChatRoom} type="primary" icon={<CheckIcon size={14} />}>Thêm</Button>}
        </div>
    </div>
};

export default AddFriendToChatRoom;
