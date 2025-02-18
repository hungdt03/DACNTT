import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { UserResource } from "../../../types/user";
import followService from "../../../services/followService";
import { Empty } from "antd";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../LoadingIndicator";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { useElementInfinityScroll } from "../../../hooks/useElementInfinityScroll";

type ProfileFollowerListProps = {
    userId: string
}

const ProfileFollowerList: FC<ProfileFollowerListProps> = ({
    userId
}) => {
    const [followers, setFollowers] = useState<UserResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false)

    const fetchFollowers = async (page: number, size: number) => {
        setLoading(true)
        const response = await followService.getAllFollowersByUserId(userId, page, size);

        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination)
            setFollowers(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const newFollowees = response.data.filter(item => !existingIds.has(item.id));
                return [...prev, ...newFollowees];
            });
        }
    }

    const fetchMore = () => {
        if (!pagination.hasMore || loading) return;
        fetchFollowers(pagination.page + 1, pagination.size)
    }


    useElementInfinityScroll({
        elementId: "my-profile-page",
        onLoadMore: fetchMore,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });


    useEffect(() => {
        fetchFollowers(pagination.page, pagination.size)
    }, [userId])

    return <div className="grid grid-cols-2 gap-4">
        {followers.map(follower => <Link to={`/profile/${follower.id}`} key={follower.id} className="hover:text-black flex items-center justify-between p-4 rounded-md border-[1px] border-gray-100">
            <div className="flex items-center gap-x-3">
                <img className="w-[50px] h-[50px] rounded-md border-[1px] border-gray-50" src={follower.avatar ?? images.photo} />
                <div className="flex flex-col">
                    <span className="font-semibold">{follower.fullName}</span>
                </div>
            </div>
        </Link>)}

        {followers.length === 0 && !loading && <Empty className="col-span-2" description='Không có người nào theo dõi' />}

        <div className="col-span-2">
            {loading && <LoadingIndicator />}
        </div>
    </div>
};

export default ProfileFollowerList;
