import { FC } from "react"
import { svgReaction } from "../../assets/svg"

export const PostReaction: FC = () => {
    return <div className="flex items-center gap-x-3">
        <img src={svgReaction.like} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        <img src={svgReaction.love} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        <img src={svgReaction.care} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        <img src={svgReaction.haha} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        <img src={svgReaction.wow} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        <img src={svgReaction.sad} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
        <img src={svgReaction.angry} className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
    </div>
}