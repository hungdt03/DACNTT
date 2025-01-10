import { FC } from "react";
import { ReactionType } from "../../enums/reaction";
import { svgReaction } from "../../assets/svg";

type StoryReactionProps = {
    onSelect?: (reaction: ReactionType) => void
}

const StoryReaction: FC<StoryReactionProps> = ({
    onSelect
}) => {
    return <div className="flex items-center gap-x-2">
        <button onClick={() => onSelect?.(ReactionType.LIKE)}>
            <img alt="like" src={svgReaction.like} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button>
        <button onClick={() => onSelect?.(ReactionType.LOVE)}>
            <img alt="love" src={svgReaction.love} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button>
        <button onClick={() => onSelect?.(ReactionType.CARE)}>
            <img alt="care" src={svgReaction.care} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button>
        <button onClick={() => onSelect?.(ReactionType.HAHA)}>
            <img alt="haha" src={svgReaction.haha} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button>
        <button onClick={() => onSelect?.(ReactionType.WOW)}>
            <img alt="wow" src={svgReaction.wow} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button>
        <button onClick={() => onSelect?.(ReactionType.SAD)}>
            <img alt="sad" src={svgReaction.sad} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button>
        <button onClick={() => onSelect?.(ReactionType.ANGRY)}>
            <img alt="angry" src={svgReaction.angry} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button>
    </div>
};

export default StoryReaction;
