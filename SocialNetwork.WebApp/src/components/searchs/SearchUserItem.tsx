import { FC } from "react";
import images from "../../assets";
import { SearchUserSuggestResource } from "../../types/search/search-user-suggest";
import { Link } from "react-router-dom";

type SearchUserItemProps = {
    suggestUser: SearchUserSuggestResource;
    onClick: () => void
}

const SearchUserItem: FC<SearchUserItemProps> = ({
    suggestUser,
    onClick
}) => {
    return <div onClick={onClick} className="cursor-pointer flex items-center justify-between p-2 md:p-4 bg-white border-[1px] rounded-lg">
        <div className="flex items-center gap-x-3">
            <div className="relative">
                {!suggestUser.user.haveStory
                    ? <img src={suggestUser.user.avatar ?? images.cover} className="md:w-[55px] md:h-[55px] w-[40px] h-[40px] rounded-full border-[1px] border-gray-100" />
                    : <Link className="p-[1px] border-[2px] inline-block border-primary rounded-full" to={`/stories/${suggestUser.user.id}`}><img src={suggestUser.user.avatar ?? images.cover} className="md:w-[55px] md:h-[55px] w-[40px] h-[40px] rounded-full border-[1px] border-gray-100" /></Link>
                }
                {suggestUser.user.isShowStatus && suggestUser.user.isOnline && <div className="absolute bottom-0 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
            </div>

            <div className="flex flex-col">
                <span className="font-semibold text-sm md:text-[16px] line-clamp-1">{suggestUser.user.fullName}</span>
                <span className="text-gray-600 text-xs md:text-sm line-clamp-1">
                    {suggestUser.isFriend ? 'Bạn bè' : `${suggestUser.countMutualFriends} bạn chung`}
                </span>
            </div>
        </div>
    </div>
};

export default SearchUserItem;
