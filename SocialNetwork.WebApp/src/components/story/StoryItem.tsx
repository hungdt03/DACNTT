import { FC } from "react";
import { UserStoryResource } from "../../types/userStory";
import images from "../../assets";
import { StoryType } from "../../enums/story-type.";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

type StoryItemProps = {
    story: UserStoryResource;
    onClick: () => void
}

const StoryItem: FC<StoryItemProps> = ({
    story,
    onClick
}) => {
    const { user } = useSelector(selectAuth)
    return (
        <div
            onClick={onClick}
            className="rounded-xl relative flex items-center justify-center px-4 py-6 overflow-hidden"
            style={{
                background: story.stories[0].type === StoryType.STORY_TEXT ? story.stories[0].background : `url(${story.stories[0].background})`,
                fontFamily: story.stories[0].fontFamily,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '200px',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="text-white text-center break-words break-all font-semibold text-xs">{story.stories[0].content}</div>

            <div className="absolute top-4 left-4">
                <img className="rounded-full border-[3px] border-blue-500" width='40px' height='40px' src={story.user.avatar ?? images.user} />
            </div>

            <div className="absolute left-0 bottom-0 right-0 py-2 px-2 bg-black bg-opacity-20 shadow z-10">
                <span className="text-xs text-white font-bold">
                    {user?.id === story.user.id ? 'Tin của bạn' : story.user.fullName}
                </span>
            </div>
        </div>
    )
};

export default StoryItem;
