import { FC } from "react";
import StoryRowItem from "./StoryRowItem";

const StorySidebar: FC = () => {
    return <div className="flex flex-col gap-y-4 p-4 overflow-y-auto custom-scrollbar h-full">
        <div className="flex flex-col gap-y-2">
            <span className="font-semibold text-lg">Tin của bạn</span>
            <StoryRowItem />
        </div>
        <div className="flex flex-col gap-y-1">
            <span className="font-semibold text-lg">Tất cả tin</span>
            <StoryRowItem />
            <StoryRowItem />
            <StoryRowItem />
            <StoryRowItem />
            <StoryRowItem />
            <StoryRowItem />
            <StoryRowItem />
            <StoryRowItem />
            <StoryRowItem />
        </div>
    </div>
};

export default StorySidebar;
