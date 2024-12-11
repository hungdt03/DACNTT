import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Newspaper } from "lucide-react";
import { FC } from "react";
import images from "../../assets";
import { Image } from "antd";

const ProfileRightSide: FC = () => {
    return <div className="flex flex-col h-full gap-y-4 col-span-12 lg:col-span-3 overflow-y-auto scrollbar-hide py-4">

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-2">
            <span className="font-bold text-lg text-gray-700">Hoạt động</span>

            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2 text-gray-600">
                    <Newspaper size={20} />
                    <p>Hôm nay có 2 bài viết mới</p>
                </div>
                <div className="flex items-center gap-x-2 text-gray-600">
                    <UserGroupIcon className="w-5" />
                    <p>Tổng cộng 35.757 thành viên</p>
                </div>
            </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-lg text-gray-700">File phương tiện mới đây</span>

            <div className="grid grid-cols-2 gap-1">
                <Image src={images.cover} />
                <Image src={images.cover} />
                <Image src={images.cover} />
                <Image src={images.cover} />
            </div>

            <button className="bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</button>
        </div>
    </div>
};

export default ProfileRightSide;
