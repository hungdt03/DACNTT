import { Avatar } from "antd";
import { FC } from "react";
import images from "../../assets";

const ChatAvatarStatus: FC = () => {
    return <div className="flex items-center justify-between px-2 py-2 rounded-md">
        <div className="flex flex-col justify-center items-center gap-x-3">
            <div className="relative">
                <Avatar className="w-12 h-12" size='large' src={images.user} />
                <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
            </div>
            <span className="font-medium text-xs w-12 text-center line-clamp-2">Trần Phan Hoàn Việt</span>
        </div>
    </div>
};

export default ChatAvatarStatus;
