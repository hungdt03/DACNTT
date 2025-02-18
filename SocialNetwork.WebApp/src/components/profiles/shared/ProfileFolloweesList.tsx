import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { UserResource } from "../../../types/user";
import followService from "../../../services/followService";
import { Empty } from "antd";
import { Link } from "react-router-dom";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { useElementInfinityScroll } from "../../../hooks/useElementInfinityScroll";
import LoadingIndicator from "../../LoadingIndicator";

type ProfileFolloweeListProps = {
    userId: string
}

const ProfileFolloweeList: FC<ProfileFolloweeListProps> = ({
    userId
}) => {
    const [followees, setFollowees] = useState<UserResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false)

    const fetchFollowees = async (page: number, size: number) => {
        setLoading(true)
        const response = await followService.getAllFolloweesByUserId(userId, page, size);

        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination)
            setFollowees(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const newFollowees = response.data.filter(item => !existingIds.has(item.id));
                return [...prev, ...newFollowees];
            });
        }
    }

    const fetchMore = () => {
        if (!pagination.hasMore || loading) return;
        fetchFollowees(pagination.page + 1, pagination.size)
    }

    useElementInfinityScroll({
        elementId: "my-profile-page",
        onLoadMore: fetchMore,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });

    useEffect(() => {
        fetchFollowees(pagination.page, pagination.size)
    }, [userId])

    return <div className="grid grid-cols-2 gap-4">
        {followees.map(followee => <Link to={`/profile/${followee.id}`} key={followee.id} className="hover:text-black flex items-center justify-between p-4 rounded-md border-[1px] border-gray-100">
            <div className="flex items-center gap-x-3">
                <img className="w-[50px] h-[50px] rounded-md border-[1px] border-gray-50" src={followee.avatar ?? images.photo} />
                <div className="flex flex-col">
                    <span className="font-semibold">{followee.fullName}</span>
                </div>
            </div>
        </Link>)}

        {followees.length === 0 && !loading && <Empty className="col-span-2" description='Tài khoản chưa theo dõi ai' />}

        <div className="col-span-2">
            {loading && <LoadingIndicator />}
        </div>

    </div>
};

export default ProfileFolloweeList;
