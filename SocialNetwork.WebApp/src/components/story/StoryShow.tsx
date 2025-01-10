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
import StoryReaction from "./StoryReaction";
import cn from "../../utils/cn";
import { ReactionType } from "../../enums/reaction";
import { StoryResource } from "../../types/story";
import { toast } from "react-toastify";

export type ReactStory = {
    storyId: string;
    reactionType: ReactionType
}

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
    const [isFetch, setIsFetch] = useState(false);
    const [focus, setFocus] = useState(false);
    const [storyItem, setStoryItem] = useState<StoryResource | null>(null)

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

    const handleReactToStory = async (reaction: ReactionType) => {
        const response = await storyService.reactToStory({
            reactionType: reaction,
            storyId: storyItem?.id
        } as ReactStory);

        if(response.isSuccess) {
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className={cn("flex flex-col gap-y-2" , isFetch ? 'items-start' : 'items-center')}>
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
                    setStoryItem(story.stories[index])
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
        {isFetch ? !collapse && <div className="cursor-pointer relative" onClick={() => setCollapse(true)}>
            {viewers.length === 0 ? <button className="text-white">
                <ChevronUp size={16} />
                Chưa có người xem
            </button> : viewers.length > 0 && <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2" >
                    <span className="text-white font-bold text-sm pb-[2px] border-b-[1px] border-white">{viewers.length} người xem</span>
                    <ChevronUp size={16} strokeWidth={3} className="mb-1" color="white" />
                </div>
                <Avatar.Group>
                    {viewers.map(viewer => <img className="mx-[2px] rounded-full border-[2px] border-gray-800" width={28} height={28} key={viewer.user.id} src={viewer.user.avatar} />)}
                </Avatar.Group>
            </div>}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))'
                }}
            />
        </div>
            :
            <div className="flex justify-center gap-x-3 w-full mt-2">
                <input onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder="Trả lời" className={cn("bg-black border-white outline-white text-white border-[2px] rounded-3xl px-3 py-2", focus && 'w-full')} />
                {!focus && <StoryReaction onSelect={(reaction: ReactionType) => handleReactToStory(reaction)} />}
            </div>
        }

    </div>
};

export default StoryShow;
