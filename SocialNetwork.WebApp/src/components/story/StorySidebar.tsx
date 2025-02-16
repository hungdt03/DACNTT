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
import cn from "../../utils/cn";
import { formatTime } from "../../utils/date";

type StorySidebarProps = {
    onRefresh: () => void;
    selectStory?: UserStoryResource;
    userStories: UserStoryResource[];
    myStory?: UserStoryResource;
}

const StorySidebar: FC<StorySidebarProps> = ({
    onRefresh,
    selectStory,
    myStory,
    userStories
}) => {
    const { user } = useSelector(selectAuth)
    return <div className="flex flex-col gap-y-4 p-4 overflow-y-auto custom-scrollbar h-full">
        <div className="flex items-center gap-x-2 px-2 w-full">
            <Link to='/' className="p-2 w-9 h-9 flex items-center justify-center rounded-full text-white bg-gray-500">
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
            {myStory && myStory.stories.length > 0 ? <div className={cn("flex items-center justify-between hover:bg-gray-100 pr-2 rounded-md", myStory.user.id === selectStory?.user.id && 'bg-sky-50')}>
                <Link to={`/stories/${myStory.user.id}`} className={cn("flex items-center gap-x-2 px-1 py-2")}>
                    <div className="relative">
                        <img className={cn("p-[2px] rounded-full w-[50px] h-[50px] object-cover border-2 flex-shrink-0", myStory.haveSeen ? 'border-white' : 'border-primary')} src={myStory.user.avatar ?? images.user} />
                        <div className="absolute bottom-1 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[15px]">{myStory.user.fullName}</span>
                        <div className="flex items-center gap-x-2">
                            <span className="text-primary text-sm">{myStory.stories.length} thẻ</span>
                            <span className="text-gray-500 text-xs">{formatTime(new Date(myStory?.stories[0]?.createdDate))}</span>
                        </div>
                    </div>
                </Link>
                <Link to='/stories/create' className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                    <Plus className="text-primary" />
                </Link>
            </div> : <Link to='/stories/create' className="flex items-center gap-x-2 px-2 py-2">
                <button className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                    <Plus className="text-primary" />
                </button>
                <div className="flex flex-col gap-y-[2px] items-start">
                    <span className="font-semibold text-sm">Tạo tin</span>
                    <p className="text-gray-500 text-xs">Bạn có thể chia sẻ ảnh hoặc viết gì đó</p>
                </div>
            </Link>}
        </div>
        <div className="flex flex-col gap-y-1">
            <span className="font-semibold text-lg">Tất cả tin</span>
            {userStories.map(story => story.user.id !== user?.id && <StoryRowItem isActive={story.user.id === selectStory?.user.id} key={story.user.id} userStory={story} />)}
        </div>
    </div>
};

export default StorySidebar;
