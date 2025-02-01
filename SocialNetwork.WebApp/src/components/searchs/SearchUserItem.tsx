import { FC } from "react";
import images from "../../assets";

const SearchUserItem: FC = () => {
    return <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
        <div className="flex items-center gap-x-3">
            <img src={images.cover} className="w-[60px] h-[60px] rounded-full object-cover" />
            <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-gray-700">Nguyễn Khánh Hưng</span>
                <span className="text-gray-500">Sống tại Phan Rang - Tháp Chàm, Ninh Thuận</span>
            </div>

        </div>
        <button className="px-3 py-1 rounded-md bg-sky-50 font-semibold text-primary hover:bg-sky-100">Thêm bạn bè</button>
    </div>
};

export default SearchUserItem;
