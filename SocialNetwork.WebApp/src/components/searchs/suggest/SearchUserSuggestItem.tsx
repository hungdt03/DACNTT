import { Search } from "lucide-react";
import { FC } from "react";
import images from "../../../assets";
import { SearchUserSuggestResource } from "../../../types/search/search-user-suggest";

type SearchUserSuggestItemProps = {
    suggest: SearchUserSuggestResource;
    onClick: () => void
}

const SearchUserSuggestItem: FC<SearchUserSuggestItemProps> = ({
    suggest,
    onClick
}) => {
    return <button onClick={onClick} className="hover:text-black px-1 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
        {!suggest.isFriend && <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={14} strokeWidth={3} className="text-gray-500" />
        </span>}

        <div className="flex items-center gap-x-2">
            <img src={suggest.user.avatar ?? images.cover} className="w-[35px] h-[35px] rounded-full border-[1px] border-gray-100 object-cover" />
            <div className="flex flex-col items-start">
                <span className="text-sm font-semibold line-clamp-1">{suggest.user.fullName}</span>
                <span className="text-gray-600 text-xs line-clamp-1">
                    {suggest.isFriend ? 'Bạn bè' : `${suggest.countMutualFriends} bạn chung`}
                </span>
            </div>
        </div>
    </button>
};

export default SearchUserSuggestItem;
