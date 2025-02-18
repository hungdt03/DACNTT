import { FC } from "react";
import StoryReaction from "./StoryReaction";
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
    return <div className="w-full h-full bg-black bg-opacity-30">
        <div className="flex flex-col absolute left-0 right-0 bottom-0 gap-y-4 items-center py-8 px-4 w-full">
            <button onClick={() => toggleMore(false)} className="text-white text-sm flex gap-x-1 py-2">
                <span>Thu gọn</span>
                <ChevronDoubleDownIcon width={20} height={20} />
            </button>
            <StoryReaction onSelect={(reaction: ReactionType) => onReact(reaction)} />
        </div>
    </div>
};

export default StoryReplyBox;
