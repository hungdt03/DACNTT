import { FC } from "react";
import PostCreator from "../posts/PostCreator";
import PostGroup from "../posts/PostGroup";

const GroupPostList: FC = () => {
    return <div className="col-span-12 lg:col-span-7 flex flex-col gap-y-4 overflow-y-auto">
        <PostCreator />
        <PostGroup />
        <PostGroup />
        <PostGroup />
        <PostGroup />
        <PostGroup />
        <PostGroup />
        <PostGroup />
    </div>
};

export default GroupPostList;
