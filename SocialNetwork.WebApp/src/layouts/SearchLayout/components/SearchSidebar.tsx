import { Divider } from "antd";
import { BookAudio, Group, Newspaper, User2Icon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import cn from "../../../utils/cn";

const SearchSidebar: FC = () => {
    const [searchParam] = useSearchParams();
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        const value = searchParam.get('q');
        if(value) setSearchValue(value)
    }, [searchParam])

    return <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-y-3 p-4 bg-white col-span-3 shadow border-r-[1px] border-gray-200">
        <span className="font-bold text-xl">Kết quả tìm kiếm</span>
        <Divider className="my-3" />

        <span className="text-lg font-bold">Bộ lọc</span>
        <div className="flex flex-col gap-y-2">
            <Link to={`/search/?type=top&?q=${encodeURIComponent(searchValue)}`} className={cn("flex items-center gap-x-3 p-[6px] rounded-lg hover:bg-gray-100", (!searchParam.get('type') || searchParam.get('type') === 'top') && 'bg-gray-100')}>
                <div className="w-9 h-9 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <BookAudio size={16} />
                </div>
                <span className="font-semibold">Tất cả</span>
            </Link>
            <Link to={`/search/?type=post&q=${encodeURIComponent(searchValue)}`} className={cn("flex items-center gap-x-3 p-[6px] rounded-lg hover:bg-gray-100", searchParam.get('type') === 'post' && 'bg-gray-100')}>
                <div className="w-9 h-9 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <Newspaper size={16} />
                </div>
                <span className="font-semibold">Bài viết</span>
            </Link>
            <Link to={`/search/?type=user&q=${encodeURIComponent(searchValue)}`} className={cn("flex items-center gap-x-3 p-[6px] rounded-lg hover:bg-gray-100", searchParam.get('type') === 'user' && 'bg-gray-100')}>
                <div className="w-9 h-9 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <User2Icon size={16} />
                </div>
                <span className="font-semibold">Mọi người</span>
            </Link>
            <Link to={`/search/?type=group&q=${encodeURIComponent(searchValue)}`} className={cn("flex items-center gap-x-3 p-[6px] rounded-lg hover:bg-gray-100", searchParam.get('type') === 'group' && 'bg-gray-100')}>
                <div className="w-9 h-9 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <Group size={16} />
                </div>
                <span className="font-semibold">Nhóm</span>
            </Link>
     
        </div>
    </div>
};

export default SearchSidebar;
