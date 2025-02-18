import { ReactNode } from "react"
import { PrivacyType } from "../enums/privacy"
import { Tooltip } from "antd"
import { Lock, User } from "lucide-react"
import { ReactionType } from "../enums/reaction"
import { svgReaction } from "../assets/svg"
import images from "../assets"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { HandThumbUpIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { GroupPrivacy } from "../enums/group-privacy"

export const getPrivacyPost = (privacy: PrivacyType): ReactNode => {
    switch (privacy) {
        case PrivacyType.PRIVATE:
            return <Tooltip title='Chỉ mình tôi'>
                <span className="mb-[2px]">
                    <Lock size={14} />
                </span>
            </Tooltip>
        case PrivacyType.FRIENDS:
            return <Tooltip title='Bạn bè'>
                <span className="mb-[2px]">
                    <User size={14} />
                </span>
            </Tooltip>
        case PrivacyType.GROUP_PUBLIC:
            return <Tooltip title='Nhóm công khai'>
                <span className="mb-[2px]">
                    <UserGroupIcon width={14} />
                </span>
            </Tooltip>
        case PrivacyType.GROUP_PRIVATE:
            return <Tooltip title='Nhóm riêng tư'>
                <span className="mb-[2px]">
                    <UserGroupIcon width={14} />
                </span>
            </Tooltip>
        case PrivacyType.PUBLIC:
        default:
            return <Tooltip title='Công khai'>
                <span className="mb-[2px]">
                    <img className="w-3 h-3" src={images.earth} alt="Public" />
                </span>
            </Tooltip>
    }
}

export const getBtnReaction = (reactionType: ReactionType | 'UNKNOWN', handleSaveReaction: (reactionType: ReactionType) => void): ReactNode => {
    if (reactionType === ReactionType.LIKE) {
        return <button onClick={() => handleSaveReaction(ReactionType.LIKE)} className="items-center py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-[13px] md:text-sm text-gray-500">
            <img alt="like" src={svgReaction.LIKE} className="md:w-4 w-[14px] md:h-4 h-[14px] hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-primary">Thích</span>
        </button>
    } else if (reactionType === ReactionType.LOVE) {
        return <button onClick={() => handleSaveReaction(ReactionType.LOVE)} className="items-center py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-[13px] md:text-sm text-gray-500">
            <img alt="like" src={svgReaction.LOVE} className="md:w-4 w-[14px] md:h-4 h-[14px] hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-red-600">Yêu thích</span>
        </button>
    } else if (reactionType === ReactionType.CARE) {
        return <button onClick={() => handleSaveReaction(ReactionType.CARE)} className="items-center py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-[13px] md:text-sm text-gray-500">
            <img alt="like" src={svgReaction.CARE} className="md:w-4 w-[14px] md:h-4 h-[14px] object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Thương thương</span>
        </button>
    } else if (reactionType === ReactionType.SAD) {
        return <button onClick={() => handleSaveReaction(ReactionType.SAD)} className="items-center py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-[13px] md:text-sm text-gray-500">
            <img alt="like" src={svgReaction.SAD} className="md:w-4 w-[14px] md:h-4 h-[14px] object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Buồn</span>
        </button>
    } else if (reactionType === ReactionType.HAHA) {
        return <button onClick={() => handleSaveReaction(ReactionType.HAHA)} className="items-center py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-[13px] md:text-sm text-gray-500">
            <img alt="like" src={svgReaction.HAHA} className="md:w-4 w-[14px] md:h-4 h-[14px] object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Haha</span>
        </button>
    } else if (reactionType === ReactionType.WOW) {
        return <button onClick={() => handleSaveReaction(ReactionType.WOW)} className="items-center py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-[13px] md:text-sm text-gray-500">
            <img alt="like" src={svgReaction.WOW} className="md:w-4 w-[14px] md:h-4 h-[14px] object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-orange-500">Wow</span>
        </button>
    } else if (reactionType === ReactionType.ANGRY) {
        return <button onClick={() => handleSaveReaction(ReactionType.ANGRY)} className="items-center py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-[13px] md:text-sm text-gray-500">
            <img alt="like" src={svgReaction.ANGRY} className="md:w-4 w-[14px] md:h-4 h-[14px] object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-orange-600">Phẫn nộ</span>
        </button>
    }

    return <button onClick={() => handleSaveReaction(ReactionType.LIKE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-[13px] md:text-sm text-gray-500">
        <HandThumbUpIcon className="md:w-[20px] w-[18px]" />
        <span>Thích</span>
    </button>
}


export const renderButtonContent = (icon: JSX.Element, label: string, imageSrc?: string) => (
    <button className="flex items-center gap-x-1 font-semibold text-gray-700 py-[1px] px-2 bg-gray-100 rounded-md">
        {imageSrc ? <img className="w-3 h-3 mb-[2px]" src={imageSrc} alt={label} /> : icon}
        <span className="text-[12px]">{label}</span>
        <FontAwesomeIcon className="mb-[2px]" icon={faCaretDown} />
    </button>
);

export const renderButtonGroupContent = (icon: JSX.Element, label: string) => (
    <button className="flex items-center gap-x-1 font-semibold text-gray-700 py-[1px] px-1 bg-gray-100 rounded-md">
        {icon}
        <span className="text-[12px]">{label}</span>
    </button>
);

export const getButtonPrivacyContent = (privacy: PrivacyType) => {
    switch (privacy) {
        case PrivacyType.PRIVATE:
            return renderButtonContent(<Lock className="mb-[3px]" size={12} />, 'Chỉ mình tôi');
        case PrivacyType.FRIENDS:
            return renderButtonContent(<User className="mb-[3px]" size={12} />, 'Bạn bè');
        case PrivacyType.PUBLIC:
        default:
            return renderButtonContent(<img className="w-3 h-3" src={images.earth} alt="Công khai" />, 'Công khai', images.earth);
    }
};

export const getGroupButtonPrivacyContent = (privacy: GroupPrivacy) => {
    switch (privacy) {
        case GroupPrivacy.PRIVATE:
            return renderButtonGroupContent(<UserGroupIcon width={14} />, 'Nhóm riêng tư');
        case GroupPrivacy.PUBLIC:
            return renderButtonGroupContent(<UserGroupIcon width={14} />, 'Nhóm công khai');
    }
};