import { History } from "lucide-react";
import { FC } from "react";
import images from "../../../assets";
import { Link } from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons'
import { SearchHistoryResource } from "../../../types/search/search-history";

type SearchHistoryGroupItemProps = {
    searchHistory: SearchHistoryResource;
    onRemove: () => void;
}

const SearchHistoryGroupItem: FC<SearchHistoryGroupItemProps> = ({
    searchHistory,
    onRemove
}) => {
    return <div className="hover:text-black px-2 py-2 rounded-md hover:bg-gray-100 flex items-center justify-between cursor-pointer">
        <Link to={`/groups/${searchHistory.group.id}`}  className="flex items-center gap-x-2 hover:text-black">
            <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                <History size={14} strokeWidth={3} className="text-gray-500" />
            </span>

            <div className="flex items-center gap-x-2">
                <img src={searchHistory.group.coverImage ?? images.cover} className="w-[32px] h-[32px] object-cover rounded-md" />
                <div className="flex flex-col">
                    <span className="text-sm font-semibold line-clamp-1">{searchHistory.group.name}</span>
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

export default SearchHistoryGroupItem;
