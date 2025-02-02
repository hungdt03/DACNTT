import { Search } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Popover, Spin } from "antd";
import useClickOutside from "../../hooks/useClickOutside";
import searchService from "../../services/searchService";
import { SearchAllSuggestResource } from "../../types/search/search-all-suggest";
import SearchSuggestionList from "../../components/searchs/SearchSuggestionList";
import SearchTextPlain from "../../components/searchs/suggest/SearchTextPlain";
import { useNavigate } from "react-router-dom";

const BoxSearchHeader: FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [openPopover, setOpenPopover] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

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
        setLoading(true)
        const response = await searchService.searchAllSuggestion(value);
        setLoading(false)
        if (response.isSuccess) {
            setSearchSuggestions(response.data)
        }

    }

    return <Popover placement="bottomLeft" arrow={false} open={openPopover} content={<div className="w-[380px]" ref={searchResultRef}>
        {
            loading ? <div className="w-full flex justify-center gap-x-4 items-center">
                <Spin size="small" />
                <span className="text-gray-500">Đang tìm kiếm</span>
            </div>
                : searchValue.trim() && !searchSuggestions?.groups.length && !searchSuggestions.users.length
                    ? <SearchTextPlain searchValue={searchValue} />
                    : <SearchSuggestionList searchValue={searchValue} suggestion={searchSuggestions} isUserBefore={searchSuggestions.users.length > searchSuggestions.groups.length} />
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
                onKeyDown={(e) => {
                    if (e.key === "Enter" && debouncedValue.trim().length > 1) {
                        navigate(`/search/?q=${encodeURIComponent(debouncedValue.trim())}`)
                    }
                }}
            />
        </div>
    </Popover>
};

export default BoxSearchHeader;
