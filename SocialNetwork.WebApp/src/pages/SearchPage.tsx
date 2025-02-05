import { FC, useEffect, useState } from "react";
import SearchGroupWrapper from "../components/searchs/SearchGroupWrapper";
import SearchPostWrapper from "../components/searchs/SearchPostWrapper";
import SearchUserWrapper from "../components/searchs/SearchUserWrapper";
import { useSearchParams } from "react-router-dom";
import { SearchAllResource } from "../types/search/search-all";
import searchService from "../services/searchService";
import SearchUserBlock from "../components/searchs/blocks/SearchUserBlock";
import SearchGroupBlock from "../components/searchs/blocks/SearchGroupBlock";
import SearchPostBlock from "../components/searchs/blocks/SearchPostBlock";

type SearchFilterType = 'top' | 'post' | 'user' | 'group'

const SearchPage: FC = () => {
    const [searchParam] = useSearchParams();
    const [searchValue, setSearchValue] = useState('')
    const [searchFilter, setSearchFilter] = useState<SearchFilterType>('top');
    const [message, setMessage] = useState('')

    const [searchResult, setSearchResult] = useState<SearchAllResource>({
        groups: [],
        posts: [],
        users: []
    })

   
    useEffect(() => {
        const paramType = searchParam.get('type');

        const paramSearch = searchParam.get('q')
        if(paramSearch) {
            setSearchValue(paramSearch)
            handleSearchTop(paramSearch)
        }

        const validFilters: SearchFilterType[] = ['top', 'post', 'user', 'group'];

        if (paramType && validFilters.includes(paramType as SearchFilterType)) {
            setSearchFilter(paramType as SearchFilterType);
        }

    }, [searchParam]);

    const handleSearchTop = async (query: string) => {
        const response = await searchService.searchAll(query);
        console.log(response)
        if(response.isSuccess) {
            setSearchResult(response.data)
            setMessage(response.message)
        }
    }

    return <div className="flex flex-col gap-y-6 max-w-screen-md w-full mx-auto p-4 rounded-lg">
        <div className="text-gray-500">{message}</div>
        {!searchFilter || searchFilter === 'top' && <div className="flex flex-col gap-y-4">
            {searchResult.users.length > 0 && <SearchUserBlock users={searchResult.users} />}
            {searchResult.groups.length > 0 && <SearchGroupBlock groups={searchResult.groups} />}
            {searchResult.posts.length > 0 && <SearchPostBlock posts={searchResult.posts} />}
        </div>}

        {searchFilter === 'group' && <SearchGroupWrapper searchValue={searchValue} />}
        {searchFilter === 'user' && <SearchUserWrapper searchValue={searchValue} />}
        {searchFilter === 'post' && <SearchPostWrapper searchValue={searchValue} />}
    </div>
};

export default SearchPage;
