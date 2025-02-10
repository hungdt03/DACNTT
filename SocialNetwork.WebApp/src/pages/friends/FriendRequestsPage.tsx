import { FC, useEffect, useState } from "react";
import friendRequestService from "../../services/friendRequestService";
import { FriendRequestResource } from "../../types/friendRequest";
import { message } from "antd";
import { inititalValues } from "../../utils/pagination";
import { useElementInfinityScroll } from "../../hooks/useElementInfinityScroll";
import RequestFriend from "../../components/friends/RequestFriend";
import LoadingIndicator from "../../components/LoadingIndicator";

const FriendRequestsPage: FC = () => {
    const [listFriendRequests, setListFriendRequests] = useState<FriendRequestResource[]>([]);

    const [pagination, setPagination] = useState(inititalValues);
    const [loading, setLoading] = useState(false);


    const loadFriendRequests = async (page: number, size: number) => {
        setLoading(true)
        const response = await friendRequestService.getAllFriendRequestByUserId(page, size);
        setLoading(false)
        if (response.isSuccess) {
            setListFriendRequests(response.data);
            setPagination(response.pagination)
        }
    };

    const fetchNext = () => {
        if (!pagination.hasMore || loading) return;
        loadFriendRequests(pagination.page + 1, pagination.size);
    }


    useEffect(() => {
        loadFriendRequests(pagination.page, pagination.size);
    }, [])


    useElementInfinityScroll({
        elementId: "group-layout",
        onLoadMore: fetchNext,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });

    const handleRejectRequestFriend = async (requestId: string) => {
        const response = await friendRequestService.cancelFriendRequest(requestId);
        if (response.isSuccess) {
            message.success(response.message);
            setListFriendRequests(prev => [...prev.filter(p => p.id !== requestId)])
        } else {
            message.error(response.message);
        }
    };

    const handleAcceptFriendRequest = async (requestId: string) => {
        const response = await friendRequestService.acceptFriendRequest(requestId);
        if (response.isSuccess) {
            message.success(response.message);
            setListFriendRequests(prev => [...prev.filter(p => p.id !== requestId)])
        } else {
            message.error(response.message);
        }
    };

    return <div className="w-full h-full p-4 overflow-y-auto">
        <div className="grid grid-cols-5 gap-4">
            {listFriendRequests.map(request => <RequestFriend onReject={() => handleRejectRequestFriend(request.id)} onAccept={() => handleAcceptFriendRequest(request.id)} key={request.id} request={request} />)}
        </div>
        {loading && <LoadingIndicator />}
        {listFriendRequests.length === 0 && !loading && <div className="flex items-center justify-center w-full h-full">
            <p className="text-center text-gray-500">Không có lời mời kết bạn nào đang chờ</p>
        </div>}
    </div>
};

export default FriendRequestsPage;
