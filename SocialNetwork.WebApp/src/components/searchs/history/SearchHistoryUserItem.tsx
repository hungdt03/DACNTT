import { History } from "lucide-react";
import { FC } from "react";
import images from "../../../assets";
import { Link } from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons'
import { SearchHistoryResource } from "../../../types/search/search-history";

type SearchHistoryUserItemProps = {
    searchHistory: SearchHistoryResource;
    onRemove: () => void
}

const SearchHistoryUserItem: FC<SearchHistoryUserItemProps> = ({
    searchHistory,
    onRemove
}) => {
    return <div className="hover:text-black py-2 rounded-md hover:bg-gray-100 flex items-center justify-between cursor-pointer px-2">
        <Link to={`/profile/${searchHistory.user.id}`} className="hover:text-black flex items-center gap-x-2">
            <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                <History size={14} strokeWidth={3} className="text-gray-500" />
            </span>

            <div className="flex items-center gap-x-2">
                <div className="relative">
                    {!searchHistory.user.haveStory
                        ? <img src={searchHistory.user.avatar ?? images.cover} className="md:w-[35px] md:h-[35px] w-[35px] h-[35px] rounded-full border-[1px] border-gray-100" />
                        : <Link className="p-[1px] border-[2px] inline-block border-primary rounded-full" to={`/stories/${searchHistory.user.id}`}><img src={searchHistory.user.avatar ?? images.cover} className="md:w-[35px] md:h-[35px] w-[35px] h-[35px] rounded-full border-[1px] border-gray-100" /></Link>
                    }
                    {searchHistory.user.isShowStatus && searchHistory.user.isOnline && <div className="absolute bottom-0 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold line-clamp-1">{searchHistory.user.fullName}</span>
                    <span className="text-gray-600 text-xs line-clamp-1">
                    </span>
                </div>
            </div>
        </Link>

        <button onClick={onRemove} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200">
            <CloseOutlined className="text-xs" />
        </button>
    </div>
};

export default SearchHistoryUserItem;
