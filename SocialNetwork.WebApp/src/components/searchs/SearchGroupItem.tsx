import { FC } from "react";
import images from "../../assets";

const SearchGroupItem: FC = () => {
    return <div className="p-4 rounded-md bg-white flex items-center justify-between shadow">
        <div className="flex items-center gap-x-3">
            <img className="w-[60px] h-[60px] rounded-md object-cover" src={images.cover} />

            <div className="flex flex-col">
                <span className="font-semibold text-[16px] text-gray-700">Cộng đồng Lập trình ASP.NET Core</span>
                <div className="flex items-center gap-x-2 text-sm text-gray-500">
                    <span>Công khai</span>
                    <span>71K thành viên</span>
                </div>
            </div>
        </div>

        <button className="px-3 py-1 rounded-md bg-sky-50 font-semibold text-primary hover:bg-sky-100">Tham gia</button>
    </div>
};

export default SearchGroupItem;
