import { FC } from "react";
import StoryReaction from "./StoryReaction";
import cn from "../../utils/cn";
import { ReactionType } from "../../enums/reaction";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";

type StoryReplyBoxProps = {
    onReact: (reaction: ReactionType) => void;
    toggleMore: (show: boolean) => void
}

const StoryReplyBox: FC<StoryReplyBoxProps> = ({
    onReact,
    toggleMore
}) => {
    return <div className="relative w-full h-full bg-gray-950 bg-opacity-40">
        <div className="flex flex-col absolute left-0 right-0 bottom-0 gap-y-4 items-center py-8 px-4 w-full">
            <button onClick={() => toggleMore(false)} className="text-white text-sm flex gap-x-1 py-2">
                <span>Thu gọn</span>
                <ChevronDoubleDownIcon width={20} height={20} />
            </button>
            <input placeholder="Trả lời" className={cn("bg-black border-white w-full outline-white text-white border-[2px] rounded-3xl px-3 py-2")} />
            <StoryReaction onSelect={(reaction: ReactionType) => onReact(reaction)} />
        </div>
    </div>
};

export default StoryReplyBox;
