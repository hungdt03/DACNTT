import { FC, useEffect, useState } from "react";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
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

    const navigate = useNavigate();

    const fetchSuggestGroups = async (value: string, page: number, size: number) => {
        setLoading(true)
        const response = await searchService.searchGroups(value, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setSuggestGroups(response.data);
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        if (searchValue)
            fetchSuggestGroups(searchValue, 1, 6)

    }, [searchParam])

    const handleRedirectToGroupPage = async (url: string, groupId: string) => {
        await searchService.addSeachGroup(groupId);
        navigate(url)
    }

    return <div className="flex flex-col gap-y-4 w-full h-full custom-scrollbar overflow-y-auto">
        {suggestGroups.map(suggestGroup => <SearchGroupItem onClick={() => handleRedirectToGroupPage(`/groups/${suggestGroup.group.id}`, suggestGroup.group.id)} key={suggestGroup.group.id} suggestGroup={suggestGroup} />)}
        {loading && <LoadingIndicator />}

    </div>
};

export default SearchGroupWrapper;
