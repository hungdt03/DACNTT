import { Search } from "lucide-react";
import { FC } from "react";
import images from "../../../assets";
import { UserResource } from "../../../types/user";

type SearchUserSuggestItemProps = {
    user: UserResource
}

const SearchUserSuggestItem: FC<SearchUserSuggestItemProps> = ({
    user
}) => {
    return <div className="px-1 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
        <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={14} strokeWidth={3} className="text-gray-500" />
        </span>

        <div className="flex items-center gap-x-2">
            <img src={images.cover} className="w-[35px] h-[35px] rounded-full border-[1px] border-gray-100" />
            <div className="flex flex-col">
                <span className="text-sm font-semibold line-clamp-1">{user.fullName}</span>
                <span className="text-gray-600 text-xs line-clamp-1">Bạn bè</span>
            </div>
        </div>
    </div>
};

export default SearchUserSuggestItem;
