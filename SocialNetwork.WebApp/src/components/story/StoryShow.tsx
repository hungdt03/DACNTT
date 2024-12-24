import { FC } from "react";
import { Story } from "react-insta-stories/dist/interfaces";
import Stories from 'react-insta-stories';

type StoryShowProps = {
    story: Story[];
    onEnd: () => void
}

const StoryShow: FC<StoryShowProps> = ({
    story,
    onEnd
}) => {
    return <div className="rounded-xl overflow-hidden">
        <Stories
        stories={story}
        defaultInterval={3000}
        width={300}
        height={500}
        onAllStoriesEnd={onEnd}
    />
    </div>
};

export default StoryShow;
