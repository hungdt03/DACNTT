import { FC } from "react";
import { StoryResource } from "../../types/story";
import { StoryType } from "../../enums/story-type.";
import { formatTime } from "../../utils/date";
import { Ellipsis, Pause, Play } from "lucide-react";
import { Popover } from "antd";

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
        className="w-full h-full flex items-center justify-center"
        style={{
            background: story.type === StoryType.STORY_TEXT ? story.background : `url(${story.background})`,
            backgroundSize: 'cover'
        }}
    >
        <div className="absolute z-[1000] left-0 top-5 right-0 flex justify-between px-3">
            <div className="flex items-center gap-x-2">
                <img className="rounded-full w-[40px] h-[40px] object-cover" src={story.user.avatar} />
                <div className="flex flex-col text-white">
                    <span className="text-[15px]">{story.user.fullName}</span>
                    <span className="text-[11px]">{formatTime(new Date(story.createdDate))}</span>
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
        }} className="text-white text-center break-words break-all font-semibold px-4 py-8 text-[16px]">
            {story?.content}
        </p>
    </div>
};

export default StoryContent;
