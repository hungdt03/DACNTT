import { FC } from "react";
import Post from "../components/posts/Post";
import PostGroup from "../components/posts/PostGroup";
import SharePost from "../components/posts/SharePost";

const Feeds: FC = () => {
    return <div className="flex flex-col gap-y-4">
        <SharePost />
        <Post />
        <PostGroup />
        <SharePost />
        <PostGroup />
        <Post />
        <PostGroup />
        <SharePost />
        <PostGroup />
        <Post />
    </div>
};

export default Feeds;
