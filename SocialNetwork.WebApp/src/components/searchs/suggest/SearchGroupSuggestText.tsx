import { Search } from "lucide-react";
import { FC } from "react";
import { SearchGroupSuggestResource } from "../../../types/search/search-group-suggest";

type SearchGroupSuggestionTextProps = {
    suggest: SearchGroupSuggestResource;
    onClick: () => void
}

const SearchGroupSuggestionText: FC<SearchGroupSuggestionTextProps> = ({
    suggest,
    onClick
}) => {
    return <button onClick={onClick} className="hover:text-black px-1 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
        <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={14} strokeWidth={3} className="text-gray-500" />
        </span>

        <span className="text-sm font-semibold line-clamp-1">{suggest.group.name}</span>
    </button>
};

export default SearchGroupSuggestionText;
