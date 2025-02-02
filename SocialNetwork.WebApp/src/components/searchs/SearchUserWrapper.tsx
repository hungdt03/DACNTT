import { FC, useEffect, useState } from "react";
import SearchUserItem from "./SearchUserItem";
import { UserResource } from "../../types/user";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useSearchParams } from "react-router-dom";
import searchService from "../../services/searchService";
import { SearchUserSuggestResource } from "../../types/search/search-user-suggest";

type SearchUserWrapperProps = {
    searchValue: string
}

const SearchUserWrapper: FC<SearchUserWrapperProps> = ({
    searchValue
}) => {
    const [searchParam] = useSearchParams();
    const [suggestUsers, setSuggestUsers] = useState<SearchUserSuggestResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false)

    const fetchUsers = async (value: string, page: number, size: number) => {
        setLoading(true)
        const response = await searchService.searchUsers(value, page, size);
        setLoading(false)
        if(response.isSuccess) {
            setSuggestUsers(response.data);
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        if(searchValue)
            fetchUsers(searchValue, 1, 6)

    }, [searchParam])

    return <div className="flex flex-col gap-y-4 w-full h-full custom-scrollbar overflow-y-auto">
        {suggestUsers.map(suggestUser => <SearchUserItem key={suggestUser.user.id} suggestUser={suggestUser} />)}
    </div>
};

export default SearchUserWrapper;
