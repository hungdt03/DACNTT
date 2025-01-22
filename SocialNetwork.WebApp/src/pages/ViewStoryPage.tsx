import { FC, useEffect, useState } from "react";
import { UserStoryResource } from "../types/userStory";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/slices/auth-slice";
import storyService from "../services/storyService";
import StorySidebar from "../components/story/StorySidebar";
import StoryShow from "../components/story/StoryShow";
import { useNavigate, useParams } from "react-router-dom";

const ViewStoryPage: FC = () => {
    const { userId } = useParams();
    
    const [userStory, setUserStory] = useState<UserStoryResource>();
    const [userStories, setUserStories] = useState<UserStoryResource[]>([]);
    const { user } = useSelector(selectAuth);
    const navigate = useNavigate()

    const fetchStories = async () => {
        if(!userId) return;
        const response = await storyService.getUserStoryByUserId(userId);
        if(response.isSuccess) {
            setUserStory(response.data)
        }
    }

    const fetchUserStories = async () => {
        const response = await storyService.getAllStories();
        if (response.isSuccess) {
            setUserStories(response.data)
        }
    }

    useEffect(() => {
        fetchStories()
        fetchUserStories()
    }, [userId])

    const handleDeleteStory = (storyId: string) => {
        setUserStories(prev => {
            const updateList = [...prev]
            const myStoryIdx = updateList.findIndex(item => item.user.id === user?.id);

            if(myStoryIdx !== -1) {
                updateList[myStoryIdx].stories = [...updateList[myStoryIdx].stories.filter(s => s.id !== storyId)]
            }

            return updateList;
        })
    }

    const handleNextStory = () => {
        const excludeMe = userStories.filter(item => item.user.id !== user?.id)
        if(userStory?.user.id !== user?.id) {
            const findIndex = excludeMe.findIndex(u => u.user.id === userStory?.user.id);
            if(findIndex !== -1 && findIndex < excludeMe.length - 1) {
                navigate(`/stories/${excludeMe[findIndex + 1].user.id}`)
            }
        } else if(excludeMe.length > 0) {
            navigate(`/stories/${excludeMe[0].user.id}`)
        }
    }

    return <div className="grid grid-cols-12 h-screen">
        <div className="lg:col-span-4 xl:col-span-3 lg:block hidden bg-white h-full overflow-y-auto">
            {userStory && <StorySidebar selectStory={userStory} onRefresh={fetchUserStories} userStories={userStories} />}
        </div>
        <div className="lg:col-span-8 xl:col-span-9 col-span-12 h-full bg-black flex justify-center items-center">
            {userStory && <StoryShow onDelete={handleDeleteStory} onEnd={handleNextStory} story={userStory} />}
        </div>
    </div>
};

export default ViewStoryPage;
