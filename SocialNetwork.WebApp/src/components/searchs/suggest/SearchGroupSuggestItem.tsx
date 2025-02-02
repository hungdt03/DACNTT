import { Search } from "lucide-react";
import { FC } from "react";
import images from "../../../assets";
import { GroupResource } from "../../../types/group";

type SearchGroupSuggestItemProps = {
    group: GroupResource
}

const SearchGroupSuggestItem: FC<SearchGroupSuggestItemProps> = ({
    group
}) => {
    return <div className="px-1 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
        <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={14} strokeWidth={3} className="text-gray-500" />
        </span>

        <div className="flex items-center gap-x-2">
            <img src={images.cover} className="w-[40px] h-[40px] rounded-md" />
            <div className="flex flex-col">
                <span className="text-sm font-semibold line-clamp-1">{group.name}</span>
                <span className="text-gray-600 text-xs line-clamp-1">2 người bạn của bạn đã tham gia</span>
            </div>
        </div>
    </div>
};

export default SearchGroupSuggestItem;
