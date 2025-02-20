import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PostResource } from "../../types/post";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import searchService from "../../services/searchService";
import { PostType } from "../../enums/post-type";
import SharePost from "../posts/SharePost";
import PostGroup from "../posts/PostGroup";
import Post from "../posts/Post";
import LoadingIndicator from "../LoadingIndicator";


type SearchPostWrapperProps = {
    searchValue: string
}

const SearchPostWrapper: FC<SearchPostWrapperProps> = ({
    searchValue
}) => {
    const [searchParam] = useSearchParams();
    const [posts, setPosts] = useState<PostResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async (value: string, page: number, size: number) => {
        setLoading(true)
        const response = await searchService.searchPosts(value, page, size);
        console.log(response)
        setLoading(false)
        if (response.isSuccess) {
            setPosts(response.data);
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        if (searchValue)
            fetchPosts(searchValue, 1, 6)

    }, [searchParam])

    return <div className="flex flex-col gap-y-4 w-full h-full custom-scrollbar overflow-y-auto">
        {posts.map(post => {
            if (post.postType === PostType.SHARE_POST) {
                return <SharePost key={post.id} post={post} />;
            } else if (post.isGroupPost) {
                return <PostGroup key={post.id} post={post} />;
            }

            return <Post key={post.id} post={post} />;
        })}

        {loading && <LoadingIndicator />}

    </div>
};

export default SearchPostWrapper;

