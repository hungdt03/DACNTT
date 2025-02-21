import { Search } from "lucide-react";
import { FC } from "react";
import images from "../../../assets";
import { SearchGroupSuggestResource } from "../../../types/search/search-group-suggest";

type SearchGroupSuggestItemProps = {
    suggest: SearchGroupSuggestResource;
    onClick: () => void
}

const SearchGroupSuggestItem: FC<SearchGroupSuggestItemProps> = ({
    suggest,
    onClick
}) => { 
    return <button onClick={onClick} className="hover:text-black px-1 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
        {!suggest.isMember && <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={14} strokeWidth={3} className="text-gray-500" />
        </span>}

        <div className="flex items-center gap-x-2">
            <img src={suggest.group.coverImage ?? images.cover} className="w-[40px] object-cover h-[40px] rounded-md" />
            <div className="flex flex-col items-start">
                <span className="text-sm font-semibold line-clamp-1">{suggest.group.name}</span>
                <span className="text-gray-600 text-xs line-clamp-1">
                    {suggest.isMember ? 'Nhóm của bạn' : `${suggest.countFriendMembers} người bạn của bạn đã tham gia`}
                </span>
            </div>
        </div>
    </button>
};

export default SearchGroupSuggestItem;
