import { FC, useEffect, useState } from "react";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useSearchParams } from "react-router-dom";
import searchService from "../../services/searchService";
import SearchGroupItem from "./SearchGroupItem";
import { SearchGroupSuggestResource } from "../../types/search/search-group-suggest";
import LoadingIndicator from "../LoadingIndicator";

type SearchGroupWrapperProps = {
    searchValue: string
}

const SearchGroupWrapper: FC<SearchGroupWrapperProps> = ({
    searchValue
}) => {
    const [searchParam] = useSearchParams();
    const [suggestGroups, setSuggestGroups] = useState<SearchGroupSuggestResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('')

    const fetchSuggestGroups = async (value: string, page: number, size: number) => {
        setLoading(true)
        const response = await searchService.searchGroups(value, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setMessage(response.message)
            setSuggestGroups(response.data);
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        if (searchValue)
            fetchSuggestGroups(searchValue, 1, 6)

    }, [searchParam])

    return <div className="flex flex-col gap-y-4 w-full h-full custom-scrollbar overflow-y-auto">
        {!loading && suggestGroups.length === 0 && <div className="text-gray-500 md:text-[16px] text-sm text-center">{message}</div>}
        {suggestGroups.map(suggestGroup => <SearchGroupItem key={suggestGroup.group.id} suggestGroup={suggestGroup} />)}
        {loading && <LoadingIndicator />}

    </div>
};

export default SearchGroupWrapper;
