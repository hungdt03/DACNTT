import { ReactNode } from "react"
import { PrivacyType } from "../enums/privacy"
import { Tooltip } from "antd"
import { HeartIcon, Lock, User } from "lucide-react"
import { ReactionType } from "../enums/reaction"
import { svgReaction } from "../assets/svg"
import images from "../assets"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"

export const getPrivacyPost = (privacy: PrivacyType): ReactNode => {
    switch (privacy) {
        case PrivacyType.PRIVATE:
            return <Tooltip title='Chỉ mình tôi'>
                <button className="mb-[2px]">
                    <Lock size={14} />
                </button>
            </Tooltip>
        case PrivacyType.FRIENDS:
            return <Tooltip title='Bạn bè'>
                <button className="mb-[2px]">
                    <User size={14} />
                </button>
            </Tooltip>
        case PrivacyType.PUBLIC:
        default:
            return <Tooltip title='Công khai'>
                <button className="mb-[2px]">
                    <img className="w-3 h-3" src={images.earth} alt="Public" />
                </button>
            </Tooltip>
    }
}

export const getBtnReaction = (reactionType: ReactionType | 'UNKNOWN', handleSaveReaction: (reactionType: ReactionType) => void): ReactNode => {
    if (reactionType === ReactionType.LIKE) {
        return <button onClick={() => handleSaveReaction(ReactionType.LIKE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.like} className="w-4 h-4 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-primary">Thích</span>
        </button>
    } else if (reactionType === ReactionType.LOVE) {
        return <button onClick={() => handleSaveReaction(ReactionType.LOVE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.love} className="w-4 h-4 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-red-600">Yêu thích</span>
        </button>
    } else if (reactionType === ReactionType.CARE) {
        return <button onClick={() => handleSaveReaction(ReactionType.CARE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.care} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Thương thương</span>
        </button>
    } else if (reactionType === ReactionType.SAD) {
        return <button onClick={() => handleSaveReaction(ReactionType.SAD)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.sad} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Buồn</span>
        </button>
    } else if (reactionType === ReactionType.HAHA) {
        return <button onClick={() => handleSaveReaction(ReactionType.HAHA)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.haha} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Haha</span>
        </button>
    } else if (reactionType === ReactionType.WOW) {
        return <button onClick={() => handleSaveReaction(ReactionType.WOW)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.wow} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-orange-500">Wow</span>
        </button>
    } else if (reactionType === ReactionType.ANGRY) {
        return <button onClick={() => handleSaveReaction(ReactionType.ANGRY)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.angry} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-orange-600">Phẫn nộ</span>
        </button>
    }

    return <button  onClick={() => handleSaveReaction(ReactionType.LIKE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
        <HeartIcon className="h-5 w-5 text-gray-500" />
        <span>Thích</span>
    </button>
}


export const renderButtonContent = (icon: JSX.Element, label: string, imageSrc?: string) => (
    <button className="flex items-center gap-x-2 font-semibold text-gray-700 py-[1px] px-2 bg-gray-100 rounded-sm">
        {imageSrc ? <img className="w-3 h-3" src={imageSrc} alt={label} /> : icon}
        <span className="text-[13px]">{label}</span>
        <FontAwesomeIcon icon={faCaretDown} />
    </button>
);

export const getButtonPrivacyContent = (privacy: PrivacyType) => {
    switch (privacy) {
        case PrivacyType.PRIVATE:
            return renderButtonContent(<Lock size={14} />, 'Chỉ mình tôi');
        case PrivacyType.FRIENDS:
            return renderButtonContent(<User size={14} />, 'Bạn bè');
        case PrivacyType.PUBLIC:
        default:
            return renderButtonContent(<img className="w-3 h-3" src={images.earth} alt="Công khai" />, 'Công khai', images.earth);
    }
};