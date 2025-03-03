import { FC, useEffect, useState } from "react";
import { SuggestedFriendResource } from "../../types/suggested-friend";
import { inititalValues } from "../../utils/pagination";
import friendService from "../../services/friendService";
import SuggestedFriend from "../../components/friends/SuggestedFriend";
import LoadingIndicator from "../../components/LoadingIndicator";
import friendRequestService from "../../services/friendRequestService";
import { message } from "antd";
import { useElementInfinityScroll } from "../../hooks/useElementInfinityScroll";

const SuggestedFriendPage: FC = () => {
    const [suggestFriends, setSuggestFriends] = useState<SuggestedFriendResource[]>([]);
    const [pagination, setPagination] = useState(inititalValues);
    const [loading, setLoading] = useState(false);

    const fetchSuggestedFriends = async (page: number, size: number) => {
        setLoading(true)
        const response = await friendService.getSuggestedFriends(page, size);
        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination);
            setSuggestFriends(prevSuggests => {
                const existingIds = new Set(prevSuggests.map(suggest => suggest.user.id));
                const newSuggests = response.data.filter(suggest => !existingIds.has(suggest.user.id));
                return [...prevSuggests, ...newSuggests];
            });
        }
    }

    useEffect(() => {
        fetchSuggestedFriends(pagination.page, pagination.size)
    }, []);


    const fetchNext = () => {
        if (!pagination.hasMore || loading) return;
        fetchSuggestedFriends(pagination.page + 1, pagination.size);
    }

    useElementInfinityScroll({
        elementId: "friend-suggestion-page",
        onLoadMore: fetchNext,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });

    const handleAddFriend = async (userId: string) => {
        const response = await friendRequestService.createFriendRequest(userId);
        if (response.isSuccess) {
            message.success(response.message);
            setSuggestFriends(prev => {
                const updated = [...prev];
                const findIndex = updated.findIndex(f => f.user.id === userId);
                if (findIndex !== -1) updated[findIndex].isAdd = true;
                return updated;
            })
        } else {
            message.error(response.message)
        }
    }

    const handleCancelRequest = async (userId: string) => {
        const response = await friendRequestService.cancelFriendRequestByUserId(userId);
        if (response.isSuccess) {
            message.success(response.message);
            setSuggestFriends(prev => {
                const updated = [...prev];
                const findIndex = updated.findIndex(f => f.user.id === userId);
                if (findIndex !== -1) updated[findIndex].isAdd = false;
                return updated;
            })
        } else {
            message.error(response.message)
        }
    }

    return <div id="friend-suggestion-page" className="w-full h-full p-4 overflow-y-auto">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
            {suggestFriends.map(suggest => <SuggestedFriend onCancel={() => handleCancelRequest(suggest.user.id)} onAddFriend={() => handleAddFriend(suggest.user.id)} key={suggest.user.id} suggest={suggest} />)}
        </div>
        {loading && <LoadingIndicator />}
        {suggestFriends.length === 0 && !loading && <div className="flex items-center justify-center w-full h-full">
            <p className="text-center text-gray-500">Không có gợi ý kết bạn phù hợp</p>
        </div>}
    </div>
};

export default SuggestedFriendPage;
