import { FC } from "react";
import StorySidebar from "./StorySidebar";
import StoryShow from "./StoryShow";
import { Story } from "react-insta-stories/dist/interfaces";


type ViewStoryProps = {
    story: Story[];
    onEnd: () => void
}

const ViewStory: FC<ViewStoryProps> = ({
    story,
    onEnd
}) => {
    return <div className="grid grid-cols-12 max-h-[600px] overflow-y-hidden">
        <div className="col-span-4 bg-white max-h-[600px] overflow-y-auto">
            <StorySidebar />
        </div>
        <div className="col-span-8 bg-black max-h-[600px] flex justify-center items-center">
            <StoryShow onEnd={onEnd} story={story} />
           
        </div>
    </div>
};

export default ViewStory;
