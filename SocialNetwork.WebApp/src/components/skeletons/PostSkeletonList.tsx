import { FC } from "react";
import PostSkeleton from "./PostSkeleton";

const PostSkeletonList: FC = () => {
    return <div className="flex flex-col gap-y-4">
        <PostSkeleton />
        <PostSkeleton />
    </div>
};

export default PostSkeletonList;
