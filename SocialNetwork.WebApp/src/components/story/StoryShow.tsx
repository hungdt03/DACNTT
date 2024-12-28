import { FC } from "react";
import Stories from 'react-insta-stories';
import { UserStoryResource } from "../../types/userStory";
import { StoryType } from "../../enums/story-type.";
import { formatTime } from "../../utils/date";

type StoryShowProps = {
    story: UserStoryResource;
    onEnd: () => void
}

const StoryShow: FC<StoryShowProps> = ({
    story,
    onEnd
}) => {
    return <div className="rounded-xl overflow-hidden">
        <Stories
            key={story.user.id}
            stories={story.stories.map(item => ({
                url: item.type === StoryType.STORY_TEXT ? '' : item.background,
                header: {
                    heading: item.user.fullName,
                    profileImage: story.user.avatar,
                    subheading: formatTime(new Date(item.createdDate)),
                },
                content: item.type === StoryType.STORY_TEXT
                    ? () => (
                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            style={{
                                background: item.type === StoryType.STORY_TEXT ? item.background : `url(${item.background})`,
                                fontFamily: item.fontFamily,
                            }}
                        >
                            <div className="absolute left-3 top-5 z-[19]">
                                <div className="flex items-center gap-x-2">
                                    <img width={40} height={40} className="rounded-full" src={story.user.avatar} />
                                    <div className="flex flex-col text-white">
                                        <span className="text-[15px]">{story.user.fullName}</span>
                                        <span className="text-[11px]">{formatTime(new Date(item.createdDate))}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-white text-center break-words break-all font-semibold px-4 py-8 text-[16px]">
                                {item?.content}
                            </p>
                        </div>
                    )
                    : undefined,
            }))}
            defaultInterval={3000}
            width={300}
            height={500}
            onAllStoriesEnd={onEnd}
        />
    </div>
};

export default StoryShow;
