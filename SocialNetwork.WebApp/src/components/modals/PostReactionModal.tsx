import { Avatar, Tabs, TabsProps } from "antd";
import { FC } from "react";
import { svgReaction } from "../../assets/svg";
import images from "../../assets";


const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Tất cả',
    },
    {
        key: '2',
        label: <div className="flex items-center gap-x-2">
            <img src={svgReaction.like} className="w-5 h-5 cursor-pointer" />
            <span>12</span>
        </div>,
    },
    {
        key: '3',
        label: <div className="flex items-center gap-x-2">
            <img src={svgReaction.love} className="w-5 h-5 cursor-pointer" />
            <span>12</span>
        </div>,
    },
    {
        key: '4',
        label: <div className="flex items-center gap-x-2">
            <img src={svgReaction.care} className="w-5 h-5 cursor-pointer" />
            <span>12</span>
        </div>,
    },
    {
        key: '5',
        label: <div className="flex items-center gap-x-2">
            <img src={svgReaction.haha} className="w-5 h-5 cursor-pointer" />
            <span>12</span>
        </div>,
    },
    {
        key: '6',
        label: <div className="flex items-center gap-x-2">
            <img src={svgReaction.sad} className="w-5 h-5 cursor-pointer" />
            <span>12</span>
        </div>,
    },
    {
        key: '7',
        label: <div className="flex items-center gap-x-2">
            <img src={svgReaction.angry} className="w-5 h-5 cursor-pointer" />
            <span>12</span>
        </div>,
    },

];

const PostReactionModal: FC = () => {
    const onChange = (key: string) => {
        console.log(key);
    };

    return <div>
        <Tabs defaultActiveKey="1" onChange={onChange} items={items} />

        <div className="flex flex-col gap-y-2 h-[500px] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                <Avatar size='large' src={images.user} />
                <span>Nguyễn Trọng Đức</span>
            </div>
        </div>
    </div>

};

export default PostReactionModal;
