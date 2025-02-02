import { FC } from "react";
import images from "../../assets";
import { SearchUserSuggestResource } from "../../types/search/search-user-suggest";

type SearchUserItemProps = {
    suggestUser: SearchUserSuggestResource
}

const SearchUserItem: FC<SearchUserItemProps> = ({
    suggestUser
}) => {
    return <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
        <div className="flex items-center gap-x-3">
            <img src={suggestUser.user.avatar ?? images.cover} className="w-[55px] h-[55px] rounded-full border-[1px] border-gray-100" />
            <div className="flex flex-col">
                <span className="font-semibold text-[16px] line-clamp-1">{suggestUser.user.fullName}</span>
                <span className="text-gray-600 text-sm line-clamp-1">
                    {suggestUser.isFriend ? 'Bạn bè' : `${suggestUser.countMutualFriends} bạn chung`}
                </span>
            </div>
        </div>
        {suggestUser.isFriend ? <button className="px-2 text-sm py-1 rounded-md bg-sky-50 font-semibold text-primary hover:bg-sky-100">Nhắn tin</button> : <button className="px-2 text-sm py-1 rounded-md bg-sky-50 font-semibold text-primary hover:bg-sky-100">Thêm bạn bè</button>}
    </div>
};

export default SearchUserItem;
