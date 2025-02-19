import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { FriendResource } from "../../../types/friend";
import friendService from "../../../services/friendService";
import { Empty } from "antd";
import { Link } from "react-router-dom";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { useElementInfinityScroll } from "../../../hooks/useElementInfinityScroll";
import LoadingIndicator from "../../LoadingIndicator";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";

type ProfileFriendListProps = {
    userId: string
}

const ProfileFriendList: FC<ProfileFriendListProps> = ({
    userId
}) => {
    const [friends, setFriends] = useState<FriendResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(selectAuth)

    const fetchFriends = async (page: number, size: number) => {
        setLoading(true)
        const response = await friendService.getAllFriendsByUserId(userId, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination)
            setFriends(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const news = response.data.filter(item => !existingIds.has(item.id));
                return [...prev, ...news];
            });
        }
    }

    const fetchMore = () => {
        if (!pagination.hasMore || loading) return;
        fetchFriends(pagination.page + 1, pagination.size)
    }

    useElementInfinityScroll({
        elementId: "my-profile-page",
        onLoadMore: fetchMore,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });


    useEffect(() => {
        fetchFriends(pagination.page, pagination.size)
    }, [])

    return <div className="grid grid-cols-2 gap-4">
        {friends.map(friend => (<div key={friend.id} className="flex items-center justify-between bg-white shadow p-4 rounded-md border-[1px] border-gray-100">
            <Link to={`/profile/${friend.id}`} className="hover:text-black flex items-center gap-x-3">
                <div className="relative">
                    <img className="w-[50px] h-[50px] rounded-md border-[1px] border-gray-50"
                        src={friend.avatar ?? images.photo} />
                    {(friend.isOnline || friend.id === user?.id) && <div className="absolute bottom-0 -right-1 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">{friend.fullName}</span>
                    <span className="text-xs text-gray-500">{friend.mutualFriends} bạn chung</span>
                </div>
            </Link>
        </div>
        ))}

        {friends.length === 0 && <Empty className="col-span-2" description='Chưa có bạn bè nào' />}
        <div className="col-span-2">
            {loading && <LoadingIndicator />}
        </div>
    </div>
};

export default ProfileFriendList;
