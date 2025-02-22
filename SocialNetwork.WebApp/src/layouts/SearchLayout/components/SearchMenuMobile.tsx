import { Divider } from "antd";
import { BookAudio, Group, Newspaper, User2Icon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import cn from "../../../utils/cn";

const SearchMenuMobile: FC = () => {
    const [searchParam] = useSearchParams();
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        const value = searchParam.get('q');
        if (value) setSearchValue(value)
    }, [searchParam])

    return <div className="z-10 sticky top-0 w-full lg:hidden flex-col gap-y-3 p-2 bg-white shadow border-r-[1px] border-gray-200">
        <div className="flex items-center justify-between">
            <span className="text-[15px]">Bộ lọc</span>
            <span className="text-[15px]">Kết quả tìm kiếm</span>
        </div>
        <Divider className="my-1" />


        <div className="flex items-center flex-wrap gap-2">
            <Link to={`/search/top/?q=${encodeURIComponent(searchValue)}`} className={cn("flex items-center gap-x-3 p-[4px] text-sm rounded-lg hover:bg-gray-100", location.pathname.includes('top') && 'bg-gray-100')}>
                <div className="w-7 h-7 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <BookAudio size={13} />
                </div>
                <span className="font-normal">Tất cả</span>
            </Link>
            <Link to={`/search/post/?q=${encodeURIComponent(searchValue)}`} className={cn("flex items-center gap-x-3 p-[4px] text-sm rounded-lg hover:bg-gray-100", location.pathname.includes('post') && 'bg-gray-100')}>
                <div className="w-7 h-7 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <Newspaper size={13} />
                </div>
                <span className="font-normal">Bài viết</span>
            </Link>
            <Link to={`/search/user/?q=${encodeURIComponent(searchValue)}`} className={cn("flex items-center gap-x-3 p-[4px] text-sm rounded-lg hover:bg-gray-100", location.pathname.includes('user') && 'bg-gray-100')}>
                <div className="w-7 h-7 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <User2Icon size={13} />
                </div>
                <span className="font-normal">Mọi người</span>
            </Link>
            <Link to={`/search/group/?q=${encodeURIComponent(searchValue)}`} className={cn("flex items-center gap-x-3 p-[4px] text-sm rounded-lg hover:bg-gray-100",  location.pathname.includes('group') && 'bg-gray-100')}>
                <div className="w-7 h-7 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <Group size={13} />
                </div>
                <span className="font-normal">Nhóm</span>
            </Link>

        </div>
    </div>
};

export default SearchMenuMobile;
