import { FC, useEffect } from "react";
import { StoryResource } from "../../types/story";
import { StoryType } from "../../enums/story-type.";
import { formatTime } from "../../utils/date";
import { Ellipsis, Lock, Pause, Play, User } from "lucide-react";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import { PrivacyType } from "../../enums/privacy";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";


export const getStoryPrivacyButton = (privacy: PrivacyType) => {
    switch (privacy) {
        case PrivacyType.PRIVATE:
            return <Lock className="text-white" size={14} />
        case PrivacyType.FRIENDS:
            return <User className="text-white" size={14} />;
        case PrivacyType.PUBLIC:
            return <GlobeAsiaAustraliaIcon className="text-white" width={14} />;
        default:
            return null;
    }
};

export const getTopReactions = (reactions?: string[], top: number = 3) => {
    const counts = reactions?.reduce((acc, reaction) => {
        acc[reaction] = (acc[reaction] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return counts
        ? Object.entries(counts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, top) // Lấy top N
            .map(([reactionType, count]) => ({ reactionType, count }))
        : [];
};

type StoryContentProps = {
    story: StoryResource;
    isPlay: boolean;
    onPause: () => void;
    onPlay: () => void;
    onDelete: () => void;
    isMine: boolean;
}

const StoryContent: FC<StoryContentProps> = ({
    story,
    isPlay,
    isMine,
    onPause,
    onPlay,
    onDelete
}) => {

    return <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
            background: story.type === StoryType.STORY_TEXT ? story.background : `url(${story.background})`,
            backgroundSize: 'cover'
        }}
    >
        <div
            className="absolute inset-x-0 top-0 z-0"
            style={{
                height: "30%", // Hoặc dùng calc() để linh hoạt hơn: "calc(100% / 2.2)"
                background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))",
                pointerEvents: "none", // Đảm bảo không chặn tương tác bên dưới
            }}
        />

        <div className="absolute z-[1000] left-0 top-5 right-0 flex justify-between px-3">
            <div className="flex items-center gap-x-2">
                <div className="relative">
                    <img className="rounded-full w-[40px] h-[40px] object-cover" src={story.user.avatar} />
                    {story.user.isShowStatus && story.user.isOnline && <div className="absolute bottom-0 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                </div>
                <div className="flex flex-col text-white">
                    <Link
                        to={`/profile/${story.user.id}`}
                        className="text-[15px] hover:text-white"
                        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
                    >
                        {story.user.fullName}
                    </Link>
                    <div className="flex items-center gap-x-1">
                        <span
                            className="text-[11px]"
                            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
                        >
                            {formatTime(new Date(story.createdDate))}
                        </span>

                        <button>
                            {getStoryPrivacyButton(story.privacy as PrivacyType)}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-x-2 text-white cursor-pointer">
                {!isPlay ? <Play onClick={onPlay} size={18} /> : <Pause onClick={onPause} size={18} />}
                {isMine && <Popover trigger='click' content={<div className="flex flex-col gap-y-1">
                    <button onClick={() => onDelete()} className="w-full px-2 py-1 rounded-md hover:bg-gray-100">Xóa tin</button>
                </div>}>
                    <Ellipsis size={18} />
                </Popover>}
            </div>
        </div>

        <p style={{
            fontFamily: story.fontFamily,
        }} className="text-white text-center break-words break-all font-semibold px-4 py-8 text-[20px]">
            {story?.content}
        </p>
    </div>
};

export default StoryContent;
