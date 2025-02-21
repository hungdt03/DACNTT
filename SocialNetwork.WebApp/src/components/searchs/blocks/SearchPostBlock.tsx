import { FC } from "react";
import { PostResource } from "../../../types/post";
import { PostType } from "../../../enums/post-type";
import SharePost from "../../posts/SharePost";
import PostGroup from "../../posts/PostGroup";
import Post from "../../posts/Post";
import { Link } from "react-router-dom";

type SearchPostBlockProps = {
    posts: PostResource[];
    searchValue: string;
}

const SearchPostBlock: FC<SearchPostBlockProps> = ({
    posts,
    searchValue
}) => {
    return <div className="md:py-4">
        <div className="flex flex-col gap-y-4">
            {posts.map(post => {
                if (post.postType === PostType.SHARE_POST) {
                    return <SharePost key={post.id} post={post} />;
                } else if (post.isGroupPost) {
                    return <PostGroup key={post.id} post={post} />;
                }

                return <Post key={post.id} post={post} />;
            })}

            <Link to={`/search/post/?q=${searchValue}`} className="text-center w-full py-2 text-sm hover:bg-sky-100 rounded-md bg-sky-50 text-primary font-semibold">Xem tất cả</Link>
        </div>
    </div>
};

export default SearchPostBlock;
