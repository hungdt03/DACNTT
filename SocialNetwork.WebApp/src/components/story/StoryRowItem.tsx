import { FC } from "react";
import images from "../../assets";

const StoryRowItem: FC = () => {
    return <div className="flex items-center gap-x-2 px-1 py-2 hover:bg-gray-100 cursor-pointer rounded-xl">
        <img className="p-[2px] rounded-full border-2 border-primary" width='50px' height='50px' src={images.user} />

        <div className="flex flex-col">
            <span className="font-semibold text-[15px]">Phạm Thanh Bình</span>
            <div className="flex items-center gap-x-2">
                <span className="text-primary">2 thẻ</span>
                <span className="text-gray-500">10 giờ trước</span>
            </div>
        </div>
    </div>
};

export default StoryRowItem;
