import { Avatar, Image, Popover, Tooltip } from "antd";
import { FC } from "react";
import images from "../../assets";
import videos from "../../assets/video";
import PostMedia from "./PostMedia";

const PostShareInner: FC = () => {

    const photos = Array(3).fill(images.cover);
    const video = Array(5).fill(videos.test);

    // Kết hợp hai mảng thành một
    const media = [...photos, ...video];

    // Hàm trộn mảng ngẫu nhiên
    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;
    };

    // Trộn media ngẫu nhiên
    const shuffledMedia = shuffleArray(media);

    return <div className="flex flex-col gap-y-2 bg-white rounded-xl overflow-hidden border-[1px] border-gray-200">
        <PostMedia files={shuffledMedia} />
        <div className="px-4 py-6 flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Avatar className="w-10 h-10" src={images.user} />
                    <div className="flex flex-col gap-y-[1px]">
                        <span className="font-semibold text-[16px] text-gray-600">Bùi Văn Yên</span>
                        <div className="flex items-center gap-x-2">
                            <Tooltip title='Thứ bảy, 23 tháng 11, 2014 lúc 19:17'>
                                <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">35 phút trước</span>
                            </Tooltip>
                            <Tooltip title='Công khai'>
                                <button className="mb-[2px]">
                                    <img className="w-3 h-3" src={images.earth} alt="Public" />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-3">
                <p className="text-sm text-gray-700">Các cao nhân IT chỉ cách cứu dùm em, ổ C của lap em đang bị đỏ mặc dù đã xóa bớt đi mấy file không dùng. Giờ em phải làm sao cho nó về bth lại đây ạ :(((. Cao nhân chỉ điểm giúp em với</p>
            </div>
        </div>



    </div>
};

export default PostShareInner;
