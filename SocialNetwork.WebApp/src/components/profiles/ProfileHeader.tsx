import { FC } from "react";
import images from "../../assets";
import { Avatar, Button, Divider } from "antd";
import { MessageSquareText, MoreHorizontal, Plus, Upload } from "lucide-react";

const ProfileHeader: FC = () => {
    return <div className="bg-white w-full shadow">
        <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto overflow-hidden">
            <div className="w-full h-full relative z-10">
                <img className="w-full object-cover max-h-[25vh] h-full md:max-h-[40vh] rounded-b-xl" src={images.cover} />
                <div className="absolute right-4 top-4 md:top-auto md:bottom-4 shadow bg-sky-50 text-primary flex items-center gap-x-2 px-3 py-2 rounded-md cursor-pointer">
                    <Upload size={18} />
                    <span className="text-sm font-semibold">Thêm ảnh bìa</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-end -mt-20 gap-x-6 lg:-mt-6 px-8">
                <img className="lg:w-44 lg:h-44 w-36 h-36 rounded-full border-[1px] border-primary z-30" src={images.user} />
                <div className="lg:py-6 py-3 flex flex-col lg:flex-row items-center gap-y-4 lg:gap-y-0 lg:items-end justify-between w-full">
                    <div className="flex flex-col items-center lg:items-start gap-y-1">
                        <span className="font-bold text-3xl">Lí Đại Cương</span>
                        <div className="flex items-center gap-x-3">
                            <span className="text-gray-500">3,8K người theo dõi</span>
                            <div className="bg-primary w-2 h-2 rounded-full"></div>
                            <span className="font-semibold text-gray-500">0 đang theo dõi</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <Button icon={<Plus size={16} />} type='primary'>Thêm bạn bè</Button>
                        <button className="bg-sky-50 text-primary px-3 py-1 rounded-md flex items-end gap-x-2">
                            <MessageSquareText className="mb-1" size={16} />
                            Nhắn tin
                        </button>
                        <Button icon={<MoreHorizontal size={16} />} type='primary'></Button>
                    </div>
                </div>
            </div>

            <Divider className="my-3" />
        </div>
    </div>
};

export default ProfileHeader;
