import { FC, useEffect, useRef, useState } from "react";
import Stories, { WithSeeMore } from 'react-insta-stories';
import { UserStoryResource } from "../../types/userStory";
import StoryContent from "./StoryContent";
import storyService from "../../services/storyService";
import { message } from "antd";
import { ViewerResource } from "../../types/viewer";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import cn from "../../utils/cn";
import { ReactionType } from "../../enums/reaction";
import { StoryResource } from "../../types/story";
import StoryViewers from "./StoryViewers";
import StoryReplyBox from "./StoryReplyBox";
import StoryCollapsed from "./StoryCollapsed";
import { useSearchParams } from "react-router-dom";

export type ReactStory = {
    storyId: string;
    reactionType: ReactionType;
   
}

type StoryShowProps = {
    story: UserStoryResource;
    onEnd: () => void;
    onDelete: (storyId: string) => void
}

const StoryShow: FC<StoryShowProps> = ({
    story,
    onEnd,
    onDelete
}) => {
    const [params] = useSearchParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [viewers, setViewers] = useState<ViewerResource[]>([]);
    const [isFetch, setIsFetch] = useState(false);
    const [storyItem, setStoryItem] = useState<StoryResource | null>(null)
    const toggleRef = useRef<(show: boolean) => void>();
    const [currentIndex, setCurrentIndex] = useState(0)
    
    const { user } = useSelector(selectAuth);

    useEffect(() => {
        if (story.user.id !== user?.id) {
            setViewers([])
            setIsFetch(false)
        } else {
            setIsFetch(true)
        }
    }, [story])

    const handleViewStory = async (storyId: string) => {
        const response = await storyService.viewStory(storyId);
        if (response.isSuccess) {
            console.log(response.message)
        }
    }

    const fetchViewers = async (storyId: string) => {
        setLoading(true)
        const response = await storyService.getMyStoryViews(storyId);
        setLoading(false)
        if (response.isSuccess) {
            setViewers(response.data)
        }
    }

    const handleReactToStory = async (reaction: ReactionType) => {
        const response = await storyService.reactToStory({
            reactionType: reaction,
            storyId: storyItem?.id
        } as ReactStory);

        if (response.isSuccess) {
            console.log(response)
        } else {
            message.error(response.message)
        }
    }

    const handleDeleteStory = async (storyId: string) => {
        const response = await storyService.deleteStoryById(storyId);
        if(response.isSuccess) {
            onDelete(storyId);
            message.success(response.message);
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        const storyId = params.get('story_id');
        const notiId = params.get('noti_id');
        if(storyId && notiId) {
            const findStoryIndex = story.stories.findIndex(st => st.id === storyId);

            if(findStoryIndex !== -1) {
                setCurrentIndex(findStoryIndex)
                setStoryItem(story.stories[findStoryIndex])
            }
        }
    },  [params])
    
    return <div className={cn("h-full flex flex-col justify-center gap-y-6 md:py-4", isFetch ? 'items-start' : 'items-center')}>
        <div className="rounded-xl overflow-hidden">
            <Stories
                progressStyles={{
                    backgroundColor: 'white',
                    height: '4px',
                    borderRadius: '50px !important',
                }}
                progressWrapperStyles={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: '4px',
                    borderRadius: '50px',
                }}
                key={'story' + story.user.id}
                stories={story.stories.map(item => {
                    return {
                        duration: 10000,
                        content: ({ story, action, isPaused }) => {
                            return <WithSeeMore
                                story={story}
                                action={action}
                                customCollapsed={({
                                    toggleMore
                                }) => {
                                    toggleRef.current = toggleMore
                                    return <StoryCollapsed
                                        isFetch={isFetch}
                                        viewers={viewers}
                                        toggleMore={toggleMore}
                                    />
                                }}
                            >
                                <StoryContent
                                    isPlay={!isPaused}
                                    onPause={() => action('pause')}
                                    onPlay={() => action('play')}
                                    story={item}
                                    isMine={isFetch}
                                    onDelete={() => {
                                        action('pause')
                                        handleDeleteStory(item.id)
                                    }}
                                />

                            </WithSeeMore>
                        },
                        seeMore: () => toggleRef.current && (isFetch ? <StoryViewers
                            toggleMore={toggleRef.current}
                            viewers={viewers}
                        /> : <StoryReplyBox toggleMore={toggleRef.current} onReact={handleReactToStory} />)
                    }

                })}
                defaultInterval={10000}
                width={350}
                height={600}
                keyboardNavigation
                onAllStoriesEnd={onEnd}
                onStoryStart={(index: any) => {
                    setStoryItem(story.stories[index])
                    user?.id !== story.user.id && handleViewStory(story.stories[index].id);
                    if (isFetch) {
                        fetchViewers(story.stories[index].id);
                    }
                }}
                currentIndex={currentIndex}
            />
        </div>


    </div>
};

export default StoryShow;
