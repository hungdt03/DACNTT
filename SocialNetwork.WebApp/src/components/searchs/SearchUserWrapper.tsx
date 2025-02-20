import { FC, useEffect, useState } from "react";
import SearchUserItem from "./SearchUserItem";
import { UserResource } from "../../types/user";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import searchService from "../../services/searchService";
import { SearchUserSuggestResource } from "../../types/search/search-user-suggest";
import LoadingIndicator from "../LoadingIndicator";

type SearchUserWrapperProps = {
    searchValue: string
}

const SearchUserWrapper: FC<SearchUserWrapperProps> = ({
    searchValue
}) => {
    const [searchParam] = useSearchParams();
    const [suggestUsers, setSuggestUsers] = useState<SearchUserSuggestResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchUsers = async (value: string, page: number, size: number) => {
        setLoading(true)
        const response = await searchService.searchUsers(value, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setSuggestUsers(response.data);
            setPagination(response.pagination);
        }
    }

    useEffect(() => {
        if (searchValue)
            fetchUsers(searchValue, 1, 6)

    }, [searchParam])

    const handleRedirectToUserPage = async (url: string, userId: string) => {
        await searchService.addSearchUser(userId);
        navigate(url)
    }

    return <div className="flex flex-col gap-y-4 w-full h-full custom-scrollbar overflow-y-auto">
        {suggestUsers.map(suggestUser => <SearchUserItem onClick={() => handleRedirectToUserPage(`/profile/${suggestUser.user.id}`, suggestUser.user.id)} key={suggestUser.user.id} suggestUser={suggestUser} />)}
        {loading && <LoadingIndicator />}
    </div>
};

export default SearchUserWrapper;
