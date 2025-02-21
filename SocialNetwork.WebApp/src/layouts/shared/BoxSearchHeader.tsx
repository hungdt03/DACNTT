import { Search } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Popover, Spin } from "antd";
import useClickOutside from "../../hooks/useClickOutside";
import searchService from "../../services/searchService";
import { SearchAllSuggestResource } from "../../types/search/search-all-suggest";
import SearchSuggestionList from "../../components/searchs/SearchSuggestionList";
import SearchTextPlain from "../../components/searchs/suggest/SearchTextPlain";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";

const BoxSearchHeader: FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [openPopover, setOpenPopover] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchClick, setSearchClick] = useState(false)

    const [searchSuggestions, setSearchSuggestions] = useState<SearchAllSuggestResource>({
        groups: [],
        users: []
    })

    const searchResultRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [searchParam] = useSearchParams();
    useClickOutside(searchResultRef, () => setOpenPopover(false), inputRef);

    useEffect(() => {
        const paramSearch = searchParam.get('q')
        if (paramSearch) {
            setSearchValue(paramSearch)
        }
    }, [searchParam]);

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

    const handleClickSuggestText = async (value: string) => {
        setSearchClick(true)
        await searchService.addSearchTextPlain(searchValue);
        setSearchClick(false)
        navigate(`/search/top/?q=${encodeURIComponent(value)}`)
        setOpenPopover(false)
    }

    return <Popover placement="bottomLeft" arrow={false} open={openPopover} content={<div className="w-[280px] md:w-[380px]" ref={searchResultRef}>
        {
            loading ? <div className="w-full flex justify-center gap-x-4 items-center">
                <LoadingIndicator />
            </div>
                : (searchValue.trim() && !searchSuggestions?.groups.length && !searchSuggestions.users.length)
                    ? <SearchTextPlain disabled={searchClick} onClick={() => handleClickSuggestText(searchValue)} searchValue={searchValue} />
                    : <SearchSuggestionList searchValue={searchValue} suggestion={searchSuggestions} />
        }
    </div>}>
        <div className="flex items-center gap-x-4 px-3 py-[6px] md:py-2 rounded-md border-[1px] bg-gray-100 border-slate-100 w-full md:w-[380px]">
            <Search size={18} />
            <input
                ref={inputRef}
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value)
                }}
                onFocus={() => setOpenPopover(true)}
                className="w-full md:block border-none outline-none text-sm md:text-[16px] bg-gray-100"
                placeholder="Tìm kiếm ở đây ..."
                onKeyDown={async (e) => {
                    if (e.key === "Enter" && searchValue.trim().length > 1) {
                        await searchService.addSearchTextPlain(searchValue);
                        navigate(`/search/top/?q=${encodeURIComponent(searchValue.trim())}`)
                    }
                }}
            />
        </div>
    </Popover>
};

export default BoxSearchHeader;
