import { Avatar } from "antd";
import { FC } from "react";
import images from "../../assets";

const ChatUserItem: FC = () => {
    return <div className="flex items-center gap-x-3 px-3 py-3 rounded-sm w-full hover:bg-gray-100">
        <Avatar size='large' className="flex-shrink-0" src={images.user} />
        <div className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Phạm Thanh Bình</span>
                <span className="font-semibold text-xs text-gray-500">12:32</span>
            </div>
            <p className="truncate text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure dolorem tempore reiciendis quod. Ducimus, beatae? Molestias recusandae, officia cumque quia quis enim minus molestiae nostrum! Quis iure temporibus deserunt perferendis!</p>
        </div>


    </div>
};

export default ChatUserItem;
