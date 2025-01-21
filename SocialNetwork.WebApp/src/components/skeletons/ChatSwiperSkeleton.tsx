import { Skeleton } from "antd";
import { FC } from "react";

const ChatSwiperSkeleton: FC = () => {
    return <div className="flex items-center gap-x-4 py-2">
       <Skeleton.Avatar active={true} size={'large'} shape={'circle'} />
       <Skeleton.Avatar active={true} size={'large'} shape={'circle'} />
       <Skeleton.Avatar active={true} size={'large'} shape={'circle'} />
       <Skeleton.Avatar active={true} size={'large'} shape={'circle'} />
       <Skeleton.Avatar active={true} size={'large'} shape={'circle'} />
       <Skeleton.Avatar active={true} size={'large'} shape={'circle'} />
       <Skeleton.Avatar active={true} size={'large'} shape={'circle'} />
    </div>
};

export default ChatSwiperSkeleton;
