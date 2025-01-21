import { FC } from "react";
import StoryRowItem from "./StoryRowItem";
import { UserStoryResource } from "../../types/userStory";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { Plus, RefreshCcw } from "lucide-react";
import { Divider, Tooltip } from "antd";
import { CloseOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import images from "../../assets";

type StorySidebarProps = {
    // onSelect: (userStory: UserStoryResource) => void
    onRefresh: () => void;
    selectStory: UserStoryResource;
    userStories: UserStoryResource[];
}

const StorySidebar: FC<StorySidebarProps> = ({
    // onSelect,
    onRefresh,
    selectStory,
    userStories
}) => {
    const { user } = useSelector(selectAuth)
    return <div className="flex flex-col gap-y-4 p-4 overflow-y-auto custom-scrollbar h-full">
        <div className="flex items-center gap-x-2 px-2 w-full">
            <Link to='/' className="p-2 w-9 h-9 flex items-center justify-center rounded-full text-white bg-gray-300">
                <CloseOutlined />
            </Link>
            <Link to='/'><img width='36px' height='36px' src={images.facebook} /></Link>
        </div>
        <Divider className="my-0" />
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Tin của bạn</span>
                <Tooltip title='Làm mới'>
                    <button onClick={() => onRefresh()} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
                        <RefreshCcw size={16} />
                    </button>
                </Tooltip>
            </div>
            <div className="flex items-center justify-between hover:bg-gray-100 pr-2 rounded-md">
                {userStories.map(story => story.user.id === user?.id && <StoryRowItem isActive={story.user.id === selectStory.user.id} key={story.user.id} userStory={story} />)}
                <Link to='/stories/create' className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                    <Plus className="text-primary" />
                </Link>
            </div>
        </div>
        <div className="flex flex-col gap-y-1">
            <span className="font-semibold text-lg">Tất cả tin</span>
            {userStories.map(story => story.user.id !== user?.id && <StoryRowItem isActive={story.user.id === selectStory.user.id} key={story.user.id} userStory={story} />)}
        </div>
    </div>
};

export default StorySidebar;
