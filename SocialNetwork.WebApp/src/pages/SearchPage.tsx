import { FC, useEffect, useState } from "react";
import SearchGroupWrapper from "../components/searchs/SearchGroupWrapper";
import SearchPostWrapper from "../components/searchs/SearchPostWrapper";
import SearchUserWrapper from "../components/searchs/SearchUserWrapper";
import { useSearchParams } from "react-router-dom";

type SearchFilterType = 'all' | 'post' | 'user' | 'group'

const SearchPage: FC = () => {
    const [searchParam] = useSearchParams();
    const [searchFilter, setSearchFilter] = useState<SearchFilterType>('all');
    
    useEffect(() => {
        const param = searchParam.get('type');

        const validFilters: SearchFilterType[] = ['all', 'post', 'user', 'group'];

        if (param && validFilters.includes(param as SearchFilterType)) {
            setSearchFilter(param as SearchFilterType);
        }
    }, [searchParam]);

    return <div className="flex flex-col gap-y-6 max-w-screen-md w-full mx-auto p-4 rounded-lg">
        <div className="text-gray-500">Tìm thấy 5 kết quả cho <strong className="text-black">kakaka</strong></div>
        {searchFilter === 'group' && <SearchGroupWrapper />}
        {searchFilter === 'user' && <SearchUserWrapper />}
        {searchFilter === 'post' && <SearchPostWrapper />}
    </div>
};

export default SearchPage;
