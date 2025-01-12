import { FC } from "react";
import images from "../../assets";
import { UserStoryResource } from "../../types/userStory";
import { formatTime } from "../../utils/date";
import cn from "../../utils/cn";

type StoryRowItemProps = {
    userStory: UserStoryResource;
    onSelect: () => void;
    isActive: boolean
}

const StoryRowItem: FC<StoryRowItemProps> = ({
    userStory,
    onSelect,
    isActive
}) => {
    return <div onClick={onSelect} className={cn("flex items-center gap-x-2 px-1 py-2 hover:bg-gray-100 cursor-pointer rounded-xl", isActive && 'bg-sky-50')}>
        <img className={cn("p-[2px] rounded-full w-[50px] h-[50px] object-cover border-2 flex-shrink-0", userStory.haveSeen ? 'border-white' : 'border-primary')}  src={userStory.user.avatar ?? images.user} />

        <div className="flex flex-col">
            <span className="font-semibold text-[15px]">{userStory.user.fullName}</span>
            <div className="flex items-center gap-x-2">
                <span className="text-primary">{userStory.stories.length} thẻ</span>
                <span className="text-gray-500">{formatTime(new Date(userStory.stories[0].createdDate))}</span>
            </div>
        </div>
    </div>
};

export default StoryRowItem;
