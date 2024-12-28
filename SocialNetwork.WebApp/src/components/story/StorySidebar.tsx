import { FC, useEffect, useState } from "react";
import StoryRowItem from "./StoryRowItem";
import { UserStoryResource } from "../../types/userStory";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { RefreshCcw } from "lucide-react";
import { Tooltip } from "antd";

type StorySidebarProps = {
    onSelect: (userStory: UserStoryResource) => void
    onRefresh: () => void;
    selectStory: UserStoryResource;
    userStories: UserStoryResource[];
}

const StorySidebar: FC<StorySidebarProps> = ({
    onSelect,
    onRefresh,
    selectStory,
    userStories
}) => {
    const { user } = useSelector(selectAuth)
    return <div className="flex flex-col gap-y-4 p-4 overflow-y-auto custom-scrollbar h-full">
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Tin của bạn</span>
                <Tooltip title='Làm mới'>
                    <button onClick={() => onRefresh()} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
                        <RefreshCcw size={16} />
                    </button>
                </Tooltip>
            </div>
            {userStories.map(story => story.user.id === user?.id && <StoryRowItem isActive={story.user.id === selectStory.user.id} onSelect={() => onSelect(story)} key={story.user.id} userStory={story} />)}
        </div>
        <div className="flex flex-col gap-y-1">
            <span className="font-semibold text-lg">Tất cả tin</span>
            {userStories.map(story => story.user.id !== user?.id && <StoryRowItem isActive={story.user.id === selectStory.user.id} onSelect={() => onSelect(story)} key={story.user.id} userStory={story} />)}
        </div>
    </div>
};

export default StorySidebar;
