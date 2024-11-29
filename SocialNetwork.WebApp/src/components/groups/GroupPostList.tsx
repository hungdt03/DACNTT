import { FC } from "react";
import Post from "../posts/Post";
import PostCreator from "../posts/PostCreator";

const GroupPostList: FC = () => {
    return <div className="col-span-12 lg:col-span-7 flex flex-col gap-y-4 overflow-y-auto">
        <PostCreator />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
    </div>
};

export default GroupPostList;
