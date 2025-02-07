import { FC, useEffect, useState } from "react";
import { SuggestedFriendResource } from "../../types/suggested-friend";
import { inititalValues } from "../../utils/pagination";
import friendService from "../../services/friendService";
import SuggestedFriend from "../../components/friends/SuggestedFriend";

const SuggestedFriendPage: FC = () => {
    const [suggestFriends, setSuggestFriends] = useState<SuggestedFriendResource[]>([]);
    const [pagination, setPagination] = useState(inititalValues);
    const [loading, setLoading] = useState(false);

    const fetchSuggestedFriends = async (page: number, size: number) => {
        setLoading(true)
        const response = await friendService.getSuggestedFriends(page, size);
       
        setTimeout(() => {
            setLoading(false)
            if(response.isSuccess) {
                setPagination(response.pagination);
                setSuggestFriends(prevSuggests => {
                    const existingIds = new Set(prevSuggests.map(suggest => suggest.user.id));
                    const newSuggests = response.data.filter(suggest => !existingIds.has(suggest.user.id));
                    return [...prevSuggests, ...newSuggests];
                });
            }
        }, 2000)
    }

    useEffect(() => {
        fetchSuggestedFriends(pagination.page, pagination.size)
    }, [])

    return <div className="w-full h-full p-4 overflow-y-auto">
        <div className="grid grid-cols-5 gap-4">
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
            {suggestFriends.map(suggest => <SuggestedFriend key={suggest.user.id} suggest={suggest}/>)}
        </div>
    </div>
};

export default SuggestedFriendPage;
