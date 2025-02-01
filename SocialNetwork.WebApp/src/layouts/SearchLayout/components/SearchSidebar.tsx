import { Divider } from "antd";
import { BookAudio } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

const SearchSidebar: FC = () => {
    return <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-y-3 p-4 bg-white col-span-3 shadow border-r-[1px] border-gray-200">
        <span className="font-bold text-xl">Kết quả tìm kiếm</span>
        <Divider className="my-3" />

        <span className="text-lg font-bold">Bộ lọc</span>
        <div className="flex flex-col gap-y-2">
            <Link to={`/search/?q=kakaka`} className="flex items-center gap-x-3 p-[6px] rounded-lg hover:bg-gray-100">
                <div className="w-9 h-9 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <BookAudio size={16} />
                </div>
                <span className="font-semibold">Tất cả</span>
            </Link>
            <Link to={`/search/?type=post`} className="flex items-center gap-x-3 p-[6px] rounded-lg hover:bg-gray-100">
                <div className="w-9 h-9 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <BookAudio size={16} />
                </div>
                <span className="font-semibold">Bài viết</span>
            </Link>
            <Link to={`/search/?type=user`} className="flex items-center gap-x-3 p-[6px] rounded-lg hover:bg-gray-100">
                <div className="w-9 h-9 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <BookAudio size={16} />
                </div>
                <span className="font-semibold">Mọi người</span>
            </Link>
            <Link to={`/search/?type=group`} className="flex items-center gap-x-3 p-[6px] rounded-lg hover:bg-gray-100">
                <div className="w-9 h-9 rounded-full bg-slate-200 hover:bg-gray-300 flex items-center justify-center">
                    <BookAudio size={16} />
                </div>
                <span className="font-semibold">Nhóm</span>
            </Link>
     
        </div>
    </div>
};

export default SearchSidebar;
