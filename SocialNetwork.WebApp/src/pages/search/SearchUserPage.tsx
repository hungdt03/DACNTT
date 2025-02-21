import { FC, useEffect, useState } from "react";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import searchService from "../../services/searchService";
import { SearchUserSuggestResource } from "../../types/search/search-user-suggest";
import SearchUserItem from "../../components/searchs/SearchUserItem";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const SearchUserWrapper: FC = ({
}) => {
    const [searchParam] = useSearchParams();
    const [suggestUsers, setSuggestUsers] = useState<SearchUserSuggestResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('')
    const [searchValue, setSearchValue] = useState('')

    const navigate = useNavigate();

    const fetchUsers = async (value: string, page: number, size: number) => {
        setLoading(true)
        const response = await searchService.searchUsers(value, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setMessage(response.message)
            setPagination(response.pagination);

            if (page === 1) {
                setSuggestUsers(response.data);
            } else {
                setSuggestUsers(prev => {
                    const existingIds = new Set(prev.map(item => item.user.id));
                    const news = response.data.filter(item => !existingIds.has(item.user.id));
                    return [...prev, ...news];
                });
            }
        }
    }

    const fetchNextPage = async () => {
        if (!pagination.hasMore || loading) return;
        fetchUsers(searchValue, pagination.page + 1, pagination.size);
    };

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchNextPage(),
        hasMore: pagination.hasMore,
        loading,
        rootMargin: "50px",
        triggerId: "search-user-scroll-trigger",
    });

    useEffect(() => {
        const paramSearch = searchParam.get('q')
        if (paramSearch) {
            setSearchValue(paramSearch)
            fetchUsers(paramSearch, 1, 6)
        }
    }, [searchParam]);

    const handleRedirectToUserPage = async (url: string, userId: string) => {
        await searchService.addSearchUser(userId);
        navigate(url)
    }

    return <div className="flex flex-col gap-y-2 md:gap-y-6 max-w-screen-md w-full h-full mx-auto p-2 md:p-4 rounded-lg">
        <div ref={containerRef} className="flex flex-col gap-y-4 w-full h-full custom-scrollbar overflow-y-auto">
            {!loading && <div className="text-gray-500 md:text-[16px] mt-2 text-sm text-center">{message}</div>}
            {suggestUsers.map(suggestUser => <SearchUserItem onClick={() => handleRedirectToUserPage(`/profile/${suggestUser.user.id}`, suggestUser.user.id)} key={suggestUser.user.id} suggestUser={suggestUser} />)}
            {loading && <LoadingIndicator title="Đang tìm kiếm" />}
            <div id="search-user-scroll-trigger" className="w-full h-1" />
        </div>
    </div >
};

export default SearchUserWrapper;
