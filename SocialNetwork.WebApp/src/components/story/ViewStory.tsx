import { FC, useEffect, useState } from "react";
import StorySidebar from "./StorySidebar";
import StoryShow from "./StoryShow";
import { UserStoryResource } from "../../types/userStory";
import storyService from "../../services/storyService";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";


type ViewStoryProps = {
    story: UserStoryResource;
}

const ViewStory: FC<ViewStoryProps> = ({
    story,
}) => {
    const [userStory, setUserStory] = useState<UserStoryResource>(story);
    const [userStories, setUserStories] = useState<UserStoryResource[]>([]);
    const { user } = useSelector(selectAuth)

    const fetchUserStories = async () => {
        const response = await storyService.getAllStories();
        if (response.isSuccess) {
            setUserStories(response.data)
        }
    }

    useEffect(() => {
        fetchUserStories()
    }, [])

    const handleNextStory = () => {
        const excludeMe = userStories.filter(item => item.user.id !== user?.id)
        if(userStory.user.id !== user?.id) {
            const findIndex = excludeMe.findIndex(u => u.user.id === userStory.user.id);
            if(findIndex !== -1 && findIndex < excludeMe.length - 1) {
                setUserStory(excludeMe[findIndex + 1])
            }
        } else if(excludeMe.length > 0) {
            setUserStory(excludeMe[0])
        }
        
    }

    return <div className="grid grid-cols-12 max-h-[600px] h-[600px] overflow-y-hidden">
        <div className="col-span-4 bg-white max-h-[600px] overflow-y-auto">
            <StorySidebar selectStory={userStory} onRefresh={fetchUserStories} userStories={userStories} onSelect={(story) => setUserStory(story)} />
        </div>
        <div className="col-span-8 bg-black max-h-[600px] h-[600px] flex justify-center items-center">
            <StoryShow onEnd={handleNextStory} story={userStory} />
        </div>
    </div>
};

export default ViewStory;
