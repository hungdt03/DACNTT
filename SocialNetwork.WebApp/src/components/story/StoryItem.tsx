import { FC } from "react";
import { UserStoryResource } from "../../types/userStory";
import images from "../../assets";
import { StoryType } from "../../enums/story-type.";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import cn from "../../utils/cn";

type StoryItemProps = {
    story: UserStoryResource;
    onClick: () => void
}

const StoryItem: FC<StoryItemProps> = ({
    story,
    onClick
}) => {
    const { user } = useSelector(selectAuth);
    return (
        <div
            onClick={onClick}
            className="rounded-xl relative flex items-center justify-center px-4 py-6 overflow-hidden cursor-pointer"
            style={{
                background: story.stories[0].type === StoryType.STORY_TEXT
                    ? story.stories[0].background
                    : `url(${story.stories[0].background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '200px',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))'
                }}
            />

            <div style={{
                fontFamily: story.stories[0].fontFamily,
            }} className="text-white text-center break-words break-all font-semibold text-xs z-10">
                {story.stories[0].content}
            </div>

            <div className="absolute top-4 left-4 z-10">
                <img className={cn("rounded-full w-[40px] h-[40px] object-cover border-[4px]", story.haveSeen ? 'border-white' : 'border-blue-600')}  src={story.user.avatar ?? images.user} />
            </div>

            <div className="absolute left-0 bottom-0 right-0 py-2 px-2">
                <span className="text-xs text-white font-bold line-clamp-1">
                    {user?.id === story.user.id ? 'Tin của bạn' : story.user.fullName}
                </span>
            </div>
        </div>
    );
};

export default StoryItem;
