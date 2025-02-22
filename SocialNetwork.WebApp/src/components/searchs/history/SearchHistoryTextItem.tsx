import { History } from "lucide-react";
import { FC } from "react";
import { CloseOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";

type SearchHistoryTextItemProps = {
    searchValue: string;
    onRemove: () => void
}

const SearchHistoryTextItem: FC<SearchHistoryTextItemProps> = ({
    searchValue,
    onRemove
}) => {
    return <div className="py-2 rounded-md hover:bg-gray-100 flex items-center justify-between cursor-pointer px-2">
        <Link to={`/search/top/?q=${encodeURIComponent(searchValue)}`} className="hover:text-black flex items-center gap-x-2">
            <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                <History size={14} strokeWidth={3} className="text-gray-500" />
            </span>
            <span className="text-sm font-semibold line-clamp-1">{searchValue}</span>

        </Link>
        <button onClick={onRemove} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200">
            <CloseOutlined className="text-xs" />
        </button>
    </div>
};

export default SearchHistoryTextItem;
