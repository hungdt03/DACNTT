import { Avatar } from "antd";
import { Search } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { CloseOutlined } from '@ant-design/icons'
import images from "../../assets";
import { FriendResource } from "../../types/friend";
import friendService from "../../services/friendService";
import { TagResource } from "../../types/tag";
import useDebounce from "../../hooks/useDebounce";
import { inititalValues } from "../../utils/pagination";
import { useElementInfinityScroll } from "../../hooks/useElementInfinityScroll";
import LoadingIndicator from "../LoadingIndicator";

type TagFriendModalProps = {
    onChange?: (tags: FriendResource[]) => void;
    onFinish?: (tags: FriendResource[]) => void;
    onTagRemove?: (tag: FriendResource) => void;
    tags?: TagResource[]
}

const TagFriendModal: FC<TagFriendModalProps> = ({
    onChange,
    onFinish,
    onTagRemove,
    tags
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [friends, setFriends] = useState<FriendResource[]>([]);
    const [selectFriends, setSelectFriends] = useState<FriendResource[]>(tags?.map(tag => tag.user) ?? [])
    const [pagination, setPagination] = useState(inititalValues);
    const [loading, setLoading] = useState(false)

    const fetchFriends = async (page: number, size: number) => {
        setLoading(true)
        const repsonse = await friendService.getAllMyFriends(page, size);

        setLoading(false)
        if (repsonse.isSuccess) {
            const newFriends = repsonse.data.filter(item => !friends.some(f => f.id === item.id));
            const filteredFriends = tags?.length
                ? newFriends.filter(item => !tags.some(tag => tag.user.id === item.id))
                : newFriends;

            setFriends(prev => [...prev, ...filteredFriends]);
            setPagination(repsonse.pagination)
        }
    }


    const fetchNextPage = () => {
        if (!pagination.hasMore || loading) return;
        fetchFriends(pagination.page, pagination.size)
    }

    useElementInfinityScroll({
        elementId: "tag-friend-element",
        onLoadMore: fetchNextPage,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });


    useEffect(() => {
        fetchFriends(pagination.page, pagination.size)
    }, [])

    const handleSelectFriend = (friend: FriendResource) => {
        if (!selectFriends.includes(friend)) {
            const updatedSelectFriends = [friend, ...selectFriends]
            setSelectFriends(updatedSelectFriends)
            setFriends(prev => [...prev.filter(item => item.id !== friend.id)])
            onChange?.(updatedSelectFriends)
        }
    }

    const handleUnselectedFriend = (friend: FriendResource) => {
        if (selectFriends.includes(friend)) {
            const updatedSelectFriends = [...selectFriends.filter(item => item.id !== friend.id)]
            setSelectFriends(prev => [...prev.filter(item => item.id !== friend.id)])
            setFriends(prev => [friend, ...prev])
            onChange?.(updatedSelectFriends)
            onTagRemove?.(friend)
        }
    }

    useEffect(() => {
        const searchFriends = async () => {
            const response = await friendService.getAllFriendsByFullName(debouncedSearchTerm);
            if (response.isSuccess) {
                setFriends([...response.data.filter(friend => !selectFriends.some(s => s.id === friend.id))]);
            }
        };

        debouncedSearchTerm.trim().length > 1 && searchFriends();
    }, [debouncedSearchTerm]);


    return <div className="flex flex-col gap-y-3 w-[400px] p-2">
        <div className="flex items-center gap-x-4">
            <div className="flex flex-1 items-center gap-x-2 px-3 py-2 rounded-3xl bg-gray-100">
                <Search size={16} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="outline-none border-none bg-gray-100 w-full" placeholder="Tìm kiếm" />
            </div>
            <button onClick={() => onFinish?.(selectFriends)} className="text-primary font-bold text-sm">Xong</button>
        </div>
        <div className="flex flex-col gap-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
            {selectFriends.length > 0 && <div className="flex flex-col gap-y-2 w-full">
                <span className="text-xs font-semibold text-gray-500 px-1">ĐÃ GẮN THẺ</span>
                <div className="flex items-center gap-2 flex-wrap w-full p-2 rounded-md border-[1px] border-gray-200 max-h-[100px] overflow-y-auto custom-scrollbar">
                    {selectFriends.map(friend => <button key={friend.id} className="flex gap-x-2 items-center p-1 px-2 rounded-md bg-sky-100 text-primary font-semibold">
                        <span>{friend.fullName}</span>
                        <CloseOutlined onClick={() => handleUnselectedFriend(friend)} className="text-xs font-bold" />
                    </button>)}
                </div>
            </div>}
            <span className="text-xs font-semibold text-gray-500 px-1">GỢI Ý</span>
            <div id="tag-friend-element" className="flex flex-col gap-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {friends.length > 0 && !loading && friends.map(friend => <div onClick={() => handleSelectFriend(friend)} key={friend.id} className="cursor-pointer flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                    <Avatar size='large' src={friend.avatar ?? images.user} />
                    <span>{friend.fullName}</span>
                </div>
                )}

                {loading && <LoadingIndicator />}

            </div>
        </div>
    </div>
};

export default TagFriendModal;
