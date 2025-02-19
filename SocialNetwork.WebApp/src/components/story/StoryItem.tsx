import { FC } from "react";
import { UserStoryResource } from "../../types/userStory";
import images from "../../assets";
import { StoryType } from "../../enums/story-type.";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";

type StoryItemProps = {
    story: UserStoryResource;
}

const StoryItem: FC<StoryItemProps> = ({
    story,
}) => {
    const { user } = useSelector(selectAuth);
    return (
        <Link
            to={`/stories/${story.user.id}`}
            className="rounded-xl md:h-[200px] h-[160px] relative flex items-center justify-center px-4 py-6 overflow-hidden cursor-pointer"
            style={{
                background: story.stories[0].type === StoryType.STORY_TEXT
                    ? story.stories[0].background
                    : `url(${story.stories[0].background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
            }} className="text-white text-center break-words break-all font-semibold text-[6px] z-10">
                {story.stories[0].content}
            </div>

            <div className="absolute top-4 left-4 z-10">
                <img className={cn("rounded-full w-[40px] h-[40px] object-cover border-[4px]", story.haveSeen ? 'border-white' : 'border-blue-600')}  src={story.user.avatar ?? images.user} />
                {(story.user.isShowStatus && story.user.isOnline || story.user.id === user?.id) && <div className="absolute bottom-0 right-1 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
            </div>

            <div className="absolute left-0 bottom-0 right-0 py-2 px-2">
                <span className="text-xs text-white font-bold line-clamp-1">
                    {user?.id === story.user.id ? 'Tin của bạn' : story.user.fullName}
                </span>
            </div>
        </Link>
    );
};

export default StoryItem;
