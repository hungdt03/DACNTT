import { FC } from "react";
import { PostResource } from "../../../types/post";
import { PostType } from "../../../enums/post-type";
import SharePost from "../../posts/SharePost";
import PostGroup from "../../posts/PostGroup";
import Post from "../../posts/Post";

type SearchPostBlockProps = {
    posts: PostResource[]
}

const SearchPostBlock: FC<SearchPostBlockProps> = ({
    posts
}) => {
    return <div className="py-4">
        <div className="flex flex-col gap-y-4">
            {posts.map(post => {
                if (post.postType === PostType.SHARE_POST) {
                    return <SharePost key={post.id} post={post} />;
                } else if (post.isGroupPost) {
                    return <PostGroup key={post.id} post={post} />;
                }

                return <Post key={post.id} post={post} />;
            })}
            <button className="w-full py-2 text-sm hover:bg-sky-100 rounded-md bg-sky-50 text-primary font-semibold">Xem tất cả</button>
        </div>
    </div>
};

export default SearchPostBlock;
