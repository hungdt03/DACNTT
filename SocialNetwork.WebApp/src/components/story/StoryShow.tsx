import { FC, useEffect, useRef, useState } from "react";
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

    const playRef = useRef<boolean>(true)

    const handlePause = () => {
        playRef.current = false;
    };

    const handlePlay = () => {
        playRef.current = true;
    };

    console.log('Rerender')

    return <div className="flex flex-col gap-y-2 items-start">
        <div className="rounded-xl overflow-hidden">
            <Stories
                // key={story.user.id}
                stories={story.stories.map(item => {
                    return {
                        content: () => <StoryContent
                            isPlay={playRef.current}
                            onPause={handlePause}
                            onPlay={handlePlay} story={item} />,
                        seeMore: () => (
                            <div style={{ padding: "20px", background: "rgba(0, 0, 0, 0.8)", color: "white" }}>
                                <p>Tin được đăng bởi: {item.user.fullName}</p>
                                <p>Nội dung: {item.content}</p>
                                <button
                                    style={{
                                        background: "white",
                                        color: "black",
                                        padding: "10px 20px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => alert("Nhấn để chuyển hướng!")}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        ),
                        seeMoreCollapsed: (isExpanded) => (
                            <div>
                                {!isExpanded ? (
                                    <p className="text-white text-center">Nhấn để xem thêm...</p>
                                ) : (
                                    <div className="text-white text-center">
                                        <p>{item.content}</p>
                                    </div>
                                )}
                            </div>
                        ),
                    }

                })}
                defaultInterval={10000}
                width={300}
                height={500}
                isPaused={true}
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
