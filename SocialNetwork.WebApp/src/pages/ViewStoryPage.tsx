import { FC, useEffect, useState } from "react";
import { UserStoryResource } from "../types/userStory";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/slices/auth-slice";
import storyService from "../services/storyService";
import StorySidebar from "../components/story/StorySidebar";
import StoryShow from "../components/story/StoryShow";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MoveLeft, Plus } from "lucide-react";
import LoadingIndicator from "../components/LoadingIndicator";
import useTitle from "../hooks/useTitle";
import { message } from "antd";

const ViewStoryPage: FC = () => {
    useTitle('Tin')
    const { userId } = useParams();

    const [loading, setLoading] = useState(false)
    const [sidebarLoading, setSidebarLoading] = useState(false)
    const [userStory, setUserStory] = useState<UserStoryResource>();
    const [userStories, setUserStories] = useState<UserStoryResource[]>([]);
    const [myStory, setMyStory] = useState<UserStoryResource>();

    const { user } = useSelector(selectAuth);
    const navigate = useNavigate()

    const fetchStories = async () => {
        if (!userId) return;
        setLoading(true)
        const response = await storyService.getUserStoryByUserId(userId);
        setLoading(false)
        if (response.isSuccess) {
            setUserStory(response.data)
        } else {
            message.warning(response.message)
        }
    }

    const fetchUserStories = async () => {
        setSidebarLoading(true)
        const response = await storyService.getAllStories();
        setSidebarLoading(false)
        if (response.isSuccess) {
            setUserStories(response.data);
            const findMyStory = response.data.find(s => s.user.id === user?.id)
            setMyStory(findMyStory)
        } 
    }

    useEffect(() => {
        fetchStories()
        fetchUserStories()
    }, [userId, user])

    const handleDeleteStory = (storyId: string) => {
        let isLast = false;
        let isUnique = false;

        setUserStories(prev => {
            const updateList = [...prev]
            const myStoryIdx = updateList.findIndex(item => item.user.id === user?.id);

            if (myStoryIdx !== -1) {
                const indexDeleteStory = updateList[myStoryIdx].stories.findIndex(s => s.id === storyId)
                if (updateList[myStoryIdx].stories.length - 1 === indexDeleteStory) isLast = true;
                updateList[myStoryIdx].stories = [...updateList[myStoryIdx].stories.filter(s => s.id !== storyId)]
                setUserStory(updateList[myStoryIdx])
            }

            if (updateList.length === 1)
                isUnique = true;

            return updateList;
        })

        if (isLast && isUnique) {
            setUserStory(undefined)
        }

        if (!isUnique && isLast) {
            setUserStory(undefined)
            handleNextStory()
        }
    }

    const handleNextStory = () => {
        const excludeMe = userStories.filter(item => item.user.id !== user?.id)
        if (userStory?.user.id !== user?.id) {
            const findIndex = excludeMe.findIndex(u => u.user.id === userStory?.user.id);
            if (findIndex !== -1 && findIndex < excludeMe.length - 1) {
                navigate(`/stories/${excludeMe[findIndex + 1].user.id}`)
            }
        } else if (excludeMe.length > 0) {
            navigate(`/stories/${excludeMe[0].user.id}`)
        }
    }

    return <div className="grid grid-cols-12 h-screen">
        <div className="lg:col-span-4 xl:col-span-3 lg:block hidden bg-white h-full overflow-y-auto">
            {sidebarLoading && <div className="w-full h-full flex items-center justify-center">
                <LoadingIndicator title="Đang tải..." />
            </div>}
            {!sidebarLoading && <StorySidebar myStory={myStory} selectStory={userStory} onRefresh={fetchUserStories} userStories={userStories} />}
        </div>
        <div className="lg:col-span-8 xl:col-span-9 col-span-12 h-full bg-black flex justify-center items-center">
            {userStory && userStory.stories.length > 0 && !loading &&
                < div className="overflow-hidden">
                    <Link to='/' className="lg:hidden flex items-center gap-x-2 text-white text-sm p-1">
                        <MoveLeft className="text-white" />
                        Trang chủ
                    </Link>
                    <StoryShow onDelete={handleDeleteStory} onEnd={handleNextStory} story={userStory} />
                </div>
            }

            {!loading && userStory?.stories.length === 0 && <Link to='/stories/create' className="flex flex-col gap-y-2 items-center">
                <button className="bg-sky-100 w-10 h-10 rounded-full text-primary flex items-center justify-center">
                    <Plus strokeWidth={3} size={16} />
                </button>
                <span className="text-[16px] font-bold text-white">Tạo tin mới</span>
            </Link>}

            {loading && <LoadingIndicator title="Đang tải tin..." />}

        </div>
    </div >
};

export default ViewStoryPage;
