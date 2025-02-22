import { FC, useEffect, useState } from "react";
import SearchUserSuggestItem from "./suggest/SearchUserSuggestItem";
import SearchUserSuggestText from "./suggest/SearchUserSuggestText";
import { SearchAllSuggestResource } from "../../types/search/search-all-suggest";
import SearchGroupSuggestItem from "./suggest/SearchGroupSuggestItem";
import SearchGroupSuggestionText from "./suggest/SearchGroupSuggestText";
import { SearchHistoryResource } from "../../types/search/search-history";
import { inititalValues } from "../../utils/pagination";
import searchService from "../../services/searchService";
import SearchHistoryGroupItem from "./history/SearchHistoryGroupItem";
import SearchHistoryUserItem from "./history/SearchHistoryUserItem";
import SearchHistoryTextItem from "./history/SearchHistoryTextItem";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import LoadingIndicator from "../LoadingIndicator";

type SearchSuggestionListProps = {
    suggestion: SearchAllSuggestResource;
    searchValue: string;
}

const SearchSuggestionList: FC<SearchSuggestionListProps> = ({
    suggestion,
    searchValue
}) => {
    const [pagination, setPagination] = useState(inititalValues);
    const [loading, setLoading] = useState(false)
    const [searchHistories, setSearchHistories] = useState<SearchHistoryResource[]>([]);
    const [searchParam] = useSearchParams()

    const navigate = useNavigate();

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => fetchNext(),
        hasMore: pagination.hasMore,
        loading: loading,
        rootMargin: "50px",
        triggerId: "search-history-scroll-trigger",
    });


    const fetchSearchHistories = async (page: number, size: number) => {
        setLoading(true)
        const response = await searchService.getUserSearchHistories(page, size);
        setLoading(false)
        if (response.isSuccess) {
            setSearchHistories(prevHistories => {
                const existingIds = new Set(prevHistories.map(m => m.id));
                const newHistories = response.data.filter(m => !existingIds.has(m.id));
                return [...prevHistories, ...newHistories];
            });
            setPagination(response.pagination)
        }
    }

    const fetchNext = () => {
        if (!pagination.hasMore || loading || searchValue.trim().length > 1) return;
        fetchSearchHistories(pagination.page + 1, pagination.size)
    }

    useEffect(() => {
        fetchSearchHistories(pagination.page, pagination.size)
    }, [])

    const handleClickUserSuggestItem = async (userId: string) => {
        const response = await searchService.addSearchUser(userId);
        if (response.isSuccess) {
            navigate(`/profile/${userId}`)
        }
    }

    const handleClickGroupSuggestItem = async (groupId: string) => {
        const response = await searchService.addSeachGroup(groupId);
        if (response.isSuccess) {
            navigate(`/groups/${groupId}`)
        }
    }

    const handleClickSuggestText = async (value: string) => {
        const response = await searchService.addSearchTextPlain(value);
        if (response.isSuccess) {
            navigate(`/search/top/?q=${encodeURIComponent(value)}`)
        }
    }

    const handleRemoveHistory = async (historyId: string) => {
        const response = await searchService.removeSearchHistory(historyId);
        if (response.isSuccess) {
            setSearchHistories(prevHistories => [...prevHistories.filter(p => p.id !== historyId)])
        }
    }

    return <div ref={containerRef} className="flex flex-col gap-y-1 max-h-[550px] overflow-y-auto custom-scrollbar">
        {searchValue.trim().length < 1 && !searchParam.get('q') && searchHistories.length === 0 && !loading && <p className="text-center text-gray-400 text-[15px]">Không có tìm kiếm nào</p>}
        {searchValue.trim().length < 1 && searchHistories.map(searchHistory => {
            if (searchHistory.group)
                return <SearchHistoryGroupItem onRemove={() => handleRemoveHistory(searchHistory.id)} key={searchHistory.id} searchHistory={searchHistory} />
            else if (searchHistory.user)
                return <SearchHistoryUserItem onRemove={() => handleRemoveHistory(searchHistory.id)} key={searchHistory.id} searchHistory={searchHistory} />
            return <SearchHistoryTextItem onRemove={() => handleRemoveHistory(searchHistory.id)} key={searchHistory.id} searchValue={searchHistory.searchText} />
        })}

        <div id="search-history-scroll-trigger" className="h-[2px] w-full"></div>
        {loading && (
            <LoadingIndicator />
        )}

        {suggestion.users.map(suggest => {
            if (suggest.isFriend)
                return <SearchUserSuggestItem onClick={() => handleClickUserSuggestItem(suggest.user.id)} key={suggest.user.id} suggest={suggest} />
            return <SearchUserSuggestText key={suggest.user.id} onClick={() => handleClickSuggestText(searchValue)} suggest={suggest} />
        })}
        {suggestion.groups.map(suggest => {
            if (suggest.isMember)
                return <SearchGroupSuggestItem onClick={() => handleClickGroupSuggestItem(suggest.group.id)} key={suggest.group.id} suggest={suggest} />
            return <SearchGroupSuggestionText onClick={() => handleClickSuggestText(searchValue)} key={suggest.group.id} suggest={suggest} />
        })}


    </div>

};

export default SearchSuggestionList;
