import { FC } from "react"
import { svgReaction } from "../../assets/svg"
import { ReactionType } from "../../enums/reaction"

type PostReactionProps = {
    onSelect?: (reaction: ReactionType) => void
}

export const PostReaction: FC<PostReactionProps> = ({
    onSelect
}) => {

    return <div className="flex items-center gap-x-3">
       <button onClick={() => onSelect?.(ReactionType.LIKE)}>
            <img alt="like"  src={svgReaction.LIKE} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button> 
       <button onClick={() => onSelect?.(ReactionType.LOVE)}>
            <img alt="love"  src={svgReaction.LOVE} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button> 
       <button onClick={() => onSelect?.(ReactionType.CARE)}>
            <img alt="care"  src={svgReaction.CARE} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button> 
       <button onClick={() => onSelect?.(ReactionType.HAHA)}>
            <img alt="haha"  src={svgReaction.HAHA} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button> 
       <button onClick={() => onSelect?.(ReactionType.WOW)}>
            <img alt="wow"  src={svgReaction.WOW} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button> 
       <button onClick={() => onSelect?.(ReactionType.SAD)}>
            <img alt="sad"  src={svgReaction.SAD} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button> 
       <button onClick={() => onSelect?.(ReactionType.ANGRY)}>
            <img alt="angry"  src={svgReaction.ANGRY} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        </button> 
    </div>
}