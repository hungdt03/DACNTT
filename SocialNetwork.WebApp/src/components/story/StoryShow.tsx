import { FC, useRef, useState } from "react";
import Stories from 'react-insta-stories';
import { UserStoryResource } from "../../types/userStory";
import StoryContent from "./StoryContent";
import { ChevronUp } from "lucide-react";

type StoryShowProps = {
    story: UserStoryResource;
    onEnd: () => void
}

const StoryShow: FC<StoryShowProps> = ({
    story,
    onEnd
}) => {

    const playRef = useRef<boolean>(true);

    const handlePause = () => {
        alert('pause')
        playRef.current = false;
    };

    const handlePlay = () => {
        playRef.current = true;
    };

    return <div className="flex flex-col gap-y-2 items-start">
        <div className="rounded-xl overflow-hidden">
            <Stories

                key={story.user.id}
                stories={story.stories.map(item => {
                    return {
                        content: () => <StoryContent
                            status={playRef.current ? 'play' : 'pause'}
                            onPause={handlePause}
                            onPlay={handlePlay} story={item} />,
                        seeMoreCollapsed: (isExpanded) => (
                            <div>
                                {!isExpanded ? (
                                    <p className="text-white text-center">Nhấn để xem thêm...</p>
                                ) : (
                                    <div className="text-white text-center">
                                        <p>Tin được đăng bởi {item.user.fullName}.</p>
                                        <p>{item?.content}</p>
                                        <p>{item?.background}</p>
                                    </div>
                                )}
                            </div>
                        ),
                    }

                })}
                defaultInterval={3000}
                width={300}
                height={500}
                isPaused={!playRef.current}
                onAllStoriesEnd={onEnd}

            />
        </div>
        <button className="text-white">
            <ChevronUp size={16} />
            Chưa có người xem
        </button>
    </div>
};

export default StoryShow;
