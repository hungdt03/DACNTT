import { FC, useEffect, useState } from "react";
import { StoryResource } from "../../types/story";
import { StoryType } from "../../enums/story-type.";
import { formatTime } from "../../utils/date";
import { CloseOutlined } from '@ant-design/icons'
import { Avatar, Divider } from "antd";
import images from "../../assets";
import { Ellipsis, Eye, Pause, Play } from "lucide-react";

type StoryContentProps = {
    story: StoryResource;
    isPlay: boolean;
    onPause: () => void;
    onPlay: () => void;
}

const StoryContent: FC<StoryContentProps> = ({
    story,
    isPlay,
    onPause,
    onPlay
}) => {

    useEffect(() => {
        console.log('Rerender')
    }, [])
 
    return <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
            background: story.type === StoryType.STORY_TEXT ? story.background : `url(${story.background})`,
            backgroundSize: 'cover'
        }}
    >
        <div className="absolute z-[2000] left-0 top-5 right-0 flex justify-between px-3">
            <div className="flex items-center gap-x-2">
                <img width={40} height={40} className="rounded-full" src={story.user.avatar} />
                <div className="flex flex-col text-white">
                    <span className="text-[15px]">{story.user.fullName}</span>
                    <span className="text-[11px]">{formatTime(new Date(story.createdDate))}</span>
                </div>
            </div>

            <div className="flex items-center gap-x-2 text-white cursor-pointer">
                {!isPlay ? <Play onClick={onPlay} size={18} /> : <Pause onClick={onPause} size={18} />}
                <Ellipsis size={18} />
            </div>
        </div>
        <p style={{
            fontFamily: story.fontFamily,
        }} className="text-white text-center break-words break-all font-semibold px-4 py-8 text-[16px]">
            {story?.content}
        </p>

        <div className="absolute top-0 left-0 right-0 bottom-0">
            <div className="w-full h-[70px] bg-black bg-opacity-45">
            </div>
            <div className="w-full h-full bg-white rounded-t-xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                    <span></span>
                    <span className="font-semibold text-[16px]">Chi tiết về tin</span>
                    <button>
                        <CloseOutlined />
                    </button>
                </div>
                <Divider className="my-3" />

                <div className="flex items-center gap-x-2">
                    <div className="w-[75px] h-[145px] bg-slate-300 rounded-md">
                        <img className="w-full h-full object-cover" src={images.music} />
                    </div>
                    <div className="w-[75px] h-[145px] bg-slate-300 rounded-md">
                        <img className="w-full h-full object-cover" src={images.music} />
                    </div>
                    <div className="w-[75px] h-[145px] bg-slate-300 rounded-md">
                        <img className="w-full h-full object-cover" src={images.music} />
                    </div>
                </div>
                <div className="py-4 flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-1">
                        <Eye />
                        <span className="font-bold text-[16px] text-gray-600">Chưa có người xem</span>
                    </div>
                    <p className="text-gray-500 text-sm">Thông tin chi tiết về những người xem tin của bạn sẽ hiển thị ở đây.</p>

                    <div className="flex flex-col gap-y-1">
                        <div className="flex items-center gap-x-3">
                            <div className="relative">
                                <Avatar size='large' src={images.user} />
                                <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">Phạm Thanh Bình</span>
                                <span className="text-xs text-gray-500">Đang hoạt động</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default StoryContent;
