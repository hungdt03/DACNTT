import { FC, useEffect, useState } from "react";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import searchService from "../../services/searchService";
import { SearchGroupSuggestResource } from "../../types/search/search-group-suggest";
import SearchGroupItem from "../../components/searchs/SearchGroupItem";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const SearchGroupPage: FC = ({
}) => {
    const [searchParam] = useSearchParams();
    const [suggestGroups, setSuggestGroups] = useState<SearchGroupSuggestResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [message, setMessage] = useState('')


    const navigate = useNavigate();

    const fetchSuggestGroups = async (value: string, page: number, size: number) => {
        setLoading(true)
        const response = await searchService.searchGroups(value, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setMessage(response.message)
            setPagination(response.pagination)

            if (page === 1) {
                setSuggestGroups(response.data);
            } else {
                setSuggestGroups(prev => {
                    const existingIds = new Set(prev.map(item => item.group.id));
                    const news = response.data.filter(item => !existingIds.has(item.group.id));
                    return [...prev, ...news];
                });
            }
        }
    }

    const fetchNextPage = async () => {
        if (!pagination.hasMore || loading) return;
        fetchSuggestGroups(searchValue, pagination.page + 1, pagination.size);
    };

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchNextPage(),
        hasMore: pagination.hasMore,
        loading,
        rootMargin: "50px",
        triggerId: "search-group-scroll-trigger",
    });

    useEffect(() => {
        const paramSearch = searchParam.get('q')
        if (paramSearch) {
            setSearchValue(paramSearch)
            fetchSuggestGroups(paramSearch, 1, 6)
        }
    }, [searchParam]);

    const handleRedirectToGroupPage = async (url: string, groupId: string) => {
        await searchService.addSeachGroup(groupId);
        navigate(url)
    }

    return <div className="flex flex-col gap-y-2 md:gap-y-6 max-w-screen-md w-full h-full mx-auto p-2 md:p-4 rounded-lg">
        <div ref={containerRef} className="flex flex-col gap-y-4 w-full h-full custom-scrollbar overflow-y-auto">
            {!loading && <div className="text-gray-500 md:text-[16px] mt-2 text-sm text-center">{message}</div>}
            {suggestGroups.map(suggestGroup => <SearchGroupItem onClick={() => handleRedirectToGroupPage(`/groups/${suggestGroup.group.id}`, suggestGroup.group.id)} key={suggestGroup.group.id} suggestGroup={suggestGroup} />)}
            {loading && <LoadingIndicator title="Đang tìm kiếm" />}
            <div id="search-group-scroll-trigger" className="w-full h-1" />
        </div>
    </div>
};

export default SearchGroupPage;
