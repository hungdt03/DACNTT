import { Search } from "lucide-react";
import { FC } from "react";
import { SearchUserSuggestResource } from "../../../types/search/search-user-suggest";
import { Link } from "react-router-dom";

type SearchUserSuggestTextProps = {
    suggest: SearchUserSuggestResource;
    searchValue: string;
}

const SearchUserSuggestText: FC<SearchUserSuggestTextProps> = ({
    suggest,
    searchValue
}) => {
    return <Link to={`/search/?q=${encodeURIComponent(searchValue)}`} className="hover:text-black px-1 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
        <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={14} strokeWidth={3} className="text-gray-500" />
        </span>

        <span className="text-sm font-semibold line-clamp-1">{suggest.user.fullName}</span>
    </Link>
};

export default SearchUserSuggestText;
