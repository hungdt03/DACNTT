import { FC, useEffect, useRef, useState } from "react";
import Stories from 'react-insta-stories';
import { UserStoryResource } from "../../types/userStory";
import StoryContent from "./StoryContent";
import { ChevronUp } from "lucide-react";
import storyService from "../../services/storyService";
import { Avatar, message } from "antd";
import { ViewerResource } from "../../types/viewer";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

type StoryShowProps = {
    story: UserStoryResource;
    onEnd: () => void
}

const StoryShow: FC<StoryShowProps> = ({
    story,
    onEnd
}) => {

    const playRef = useRef<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [collapse, setCollapse] = useState<boolean>(false);
    const [viewers, setViewers] = useState<ViewerResource[]>([]);
    const [isFetch, setIsFetch] = useState(false)

    const { user } = useSelector(selectAuth)

    const handlePause = () => {
        playRef.current = false;
    };

    const handlePlay = () => {
        playRef.current = true;
    };

    useEffect(() => {
        if (story.user.id !== user?.id) {
            setViewers([])
            setIsFetch(false)
            setCollapse(false)
        } else {
            setIsFetch(true)
        }
    }, [story])

    const handleViewStory = async (storyId: string) => {
        const response = await storyService.viewStory(storyId);
        if (response.isSuccess) {
            message.success(response.message)
        }
    }

    const fetchViewers = async (storyId: string) => {
        const response = await storyService.getMyStoryViews(storyId);
        if (response.isSuccess) {
            setViewers(response.data)
        }
    }

    return <div className="flex flex-col gap-y-2 items-start">
        <div className="rounded-xl overflow-hidden">
            <Stories
                key={'story' + story.user.id}
                stories={story.stories.map(item => {
                    return {
                        duration: 10000,
                        content: () => <StoryContent
                            isPlay={playRef.current}
                            onPause={handlePause}
                            collapse={collapse}
                            onPlay={handlePlay} story={item}
                            onClose={() => setCollapse(false)}
                            viewers={viewers}
                        />,
                    }

                })}
                defaultInterval={10000}
                width={300}
                height={500}
                isPaused={false}
                onAllStoriesEnd={onEnd}
                onStoryStart={(index: any) => {
                    user?.id !== story.user.id && handleViewStory(story.stories[index].id);
                    if (isFetch) {
                        fetchViewers(story.stories[index].id);
                    }
                }}
                onStoryEnd={(index: any) => {
                    setCollapse(false)
                }}
            />
        </div>
        {isFetch && viewers.length === 0 ? <button className="text-white">
            <ChevronUp size={16} />
            Chưa có người xem
        </button> : isFetch && viewers.length > 0 && <div className="flex flex-col gap-y-2">
            <div className="cursor-pointer flex items-center gap-x-2" onClick={() => setCollapse(true)}>
                <span className="text-white font-bold text-sm pb-[2px] border-b-[1px] border-white">{viewers.length} người xem</span>
                <ChevronUp size={16} strokeWidth={3} className="mb-1" color="white" />
            </div>
            <Avatar.Group>
                {viewers.map(viewer => <img className="mx-[2px] rounded-full border-[2px] border-gray-800" width={28} height={28} key={viewer.user.id} src={viewer.user.avatar} />)}
            </Avatar.Group>
        </div>}
    </div>
};

export default StoryShow;
