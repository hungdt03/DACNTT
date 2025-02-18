import { Search } from "lucide-react";
import { FC } from "react";

type SearchTextPlainProps = {
    searchValue: string;
    disabled: boolean;
    onClick: () => void
}

const SearchTextPlain: FC<SearchTextPlainProps> = ({
    disabled,
    searchValue,
    onClick
}) => {
    return <button disabled={disabled} onClick={onClick} className="w-full px-1 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
        <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search size={14} strokeWidth={3} className="text-gray-500" />
        </span>
        <span className="text-sm font-semibold line-clamp-1">{searchValue}</span>
    </button>
};

export default SearchTextPlain;
