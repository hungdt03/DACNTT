import { FC, useEffect, useState } from "react";
import searchService from "../../services/searchService";
import { useSearchParams } from "react-router-dom";
import { SearchAllResource } from "../../types/search/search-all";
import SearchUserBlock from "../../components/searchs/blocks/SearchUserBlock";
import SearchGroupBlock from "../../components/searchs/blocks/SearchGroupBlock";
import SearchPostBlock from "../../components/searchs/blocks/SearchPostBlock";
import LoadingIndicator from "../../components/LoadingIndicator";


const SearchTopPage: FC = () => {

    const [searchParam] = useSearchParams();
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('')

    const [searchResult, setSearchResult] = useState<SearchAllResource>({
        groups: [],
        posts: [],
        users: []
    })

    useEffect(() => {
        const paramSearch = searchParam.get('q')
        if (paramSearch) {
            setSearchValue(paramSearch)
            handleSearchTop(paramSearch)
        }
    }, [searchParam]);

    const handleSearchTop = async (query: string) => {
        setLoading(true)
        const response = await searchService.searchAll(query);
        setLoading(false)
        if (response.isSuccess) {
            setMessage(response.message)
            setSearchResult(response.data)
        }
    }

    return <div className="flex flex-col gap-y-2 md:gap-y-6 max-w-screen-md w-full mx-auto p-2 md:p-4 rounded-lg">
        {!loading && <div className="text-gray-500 md:text-[16px] mt-2 text-sm text-center">{message}</div>}
        {loading && <LoadingIndicator title="Đang tìm kiếm" />}
        {<div className="flex flex-col gap-y-4">
            {searchResult.users.length > 0 && <SearchUserBlock searchValue={searchValue} users={searchResult.users} />}
            {searchResult.groups.length > 0 && <SearchGroupBlock searchValue={searchValue} groups={searchResult.groups} />}
            {searchResult.posts.length > 0 && <SearchPostBlock searchValue={searchValue} posts={searchResult.posts} />}
        </div>}
    </div>
};

export default SearchTopPage;
