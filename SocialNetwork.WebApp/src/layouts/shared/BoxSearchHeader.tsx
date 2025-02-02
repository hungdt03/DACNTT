import { Search } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Popover } from "antd";
import useClickOutside from "../../hooks/useClickOutside";
import searchService from "../../services/searchService";
import { SearchAllSuggestResource } from "../../types/search/search-all-suggest";
import SearchSuggestionList from "../../components/searchs/SearchSuggestionList";

const BoxSearchHeader: FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [openPopover, setOpenPopover] = useState(false);

    const [searchSuggestions, setSearchSuggestions] = useState<SearchAllSuggestResource>({
        groups: [],
        users: []
    })

    const searchResultRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useClickOutside(searchResultRef, () => setOpenPopover(false), inputRef);

    const debouncedValue = useDebounce(searchValue, 300);

    useEffect(() => {
        if (debouncedValue.trim().length > 1) {
            handleSearchSuggestion(debouncedValue.trim())
        }
    }, [debouncedValue]);

    const handleSearchSuggestion = async (value: string) => {
        const response = await searchService.searchAllSuggestion(value);
        if(response.isSuccess) {
            setSearchSuggestions(response.data)
        }
    }

    return <Popover placement="bottomLeft" arrow={false} open={openPopover} content={<div className="w-[380px]" ref={searchResultRef}>
        {
            searchSuggestions?.groups.length === 0 && searchSuggestions.users.length === 0 ? <span>{searchValue}</span>
            : <SearchSuggestionList suggestion={searchSuggestions} isUserBefore={searchSuggestions.users.length > searchSuggestions.groups.length} />
        }
    </div>}>
        <div className="flex items-center gap-x-4 px-3 py-3 md:py-[6px] rounded-md border-[1px] bg-gray-100 border-slate-100 w-[380px]">
            <Search size={18} />
            <input
                ref={inputRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setOpenPopover(true)}
                className="w-full hidden md:block border-none outline-none bg-gray-100"
                placeholder="Tìm kiếm ở đây ..."
            />
        </div>
    </Popover>
};

export default BoxSearchHeader;
