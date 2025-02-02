import { Search } from "lucide-react";
import { FC } from "react";
import { SearchUserSuggestResource } from "../../../types/search/search-user-suggest";

type SearchUserSuggestTextProps = {
    suggest: SearchUserSuggestResource
}

const SearchUserSuggestText: FC<SearchUserSuggestTextProps> = ({
    suggest
}) => {
    return <div className="px-1 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
        <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={14} strokeWidth={3} className="text-gray-500" />
        </span>

        <span className="text-sm font-semibold line-clamp-1">{suggest.user.fullName}</span>
    </div>
};

export default SearchUserSuggestText;
