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
    return <div className="hover:text-black px-1 py-2 rounded-md hover:bg-gray-100 flex items-center justify-between cursor-pointer px-2">
        <Link to={`/groups/${searchHistory.group.id}`}  className="flex items-center gap-x-2">
            <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                <History size={14} strokeWidth={3} className="text-gray-500" />
            </span>

            <div className="flex items-center gap-x-2">
                <img src={searchHistory.group.coverImage ?? images.cover} className="w-[32px] h-[32px] rounded-md" />
                <div className="flex flex-col">
                    <span className="text-sm font-semibold line-clamp-1">{searchHistory.group.name}</span>
                    {/* <span className="text-gray-600 text-xs line-clamp-1">
                    {suggest.isMember ? 'Nhóm của bạn' : `${searchHistory.countFriendMembers} người bạn của bạn đã tham gia`}
                </span> */}
                </div>
            </div>
        </Link>

        <button onClick={onRemove} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200">
            <CloseOutlined className="text-xs" />
        </button>
    </div>
};

export default SearchHistoryGroupItem;
