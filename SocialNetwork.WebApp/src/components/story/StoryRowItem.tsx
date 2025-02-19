import { FC } from "react";
import images from "../../assets";
import { UserStoryResource } from "../../types/userStory";
import { formatTime } from "../../utils/date";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";

type StoryRowItemProps = {
    userStory: UserStoryResource;
    // onSelect: () => void;
    isActive: boolean
}

const StoryRowItem: FC<StoryRowItemProps> = ({
    userStory,
    // onSelect,
    isActive
}) => {
    return <Link to={`/stories/${userStory.user.id}`} className={cn("flex items-center gap-x-2 px-1 py-2 hover:bg-gray-100 cursor-pointer rounded-xl", isActive && 'bg-sky-50')}>
        <div className="relative">
            <img className={cn("p-[2px] rounded-full w-[50px] h-[50px] object-cover border-2 flex-shrink-0", userStory.haveSeen ? 'border-white' : 'border-primary')} src={userStory.user.avatar ?? images.user} />
            {userStory.user.isShowStatus && userStory.user.isOnline && <div className="absolute bottom-1 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
        </div>
        <div className="flex flex-col">
            <span className="font-semibold text-[15px]">{userStory.user.fullName}</span>
            <div className="flex items-center gap-x-2">
                <span className="text-primary text-sm">{userStory.stories.length} thẻ</span>
                <span className="text-gray-500 text-xs">{formatTime(new Date(userStory?.stories[0]?.createdDate))}</span>
            </div>
        </div>
    </Link>
};

export default StoryRowItem;
