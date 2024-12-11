import { FC, useEffect, useState } from "react";
import Post from "../components/posts/Post";
import PostCreator from "../components/posts/PostCreator";
import { Id, toast } from "react-toastify";
import { PostResource } from "../types/post";
import postService from "../services/postService";
import { PostType } from "../constants/post-type";
import SharePost from "../components/posts/SharePost";
import PostSkeletonList from "../components/skeletons/PostSkeletonList";
import { Pagination } from "../types/response";
import { inititalValues } from "../utils/pagination";

const Feeds: FC = () => {
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [posts, setPosts] = useState<PostResource[]>([]);

    const fetchPosts = async (page: number, size: number) => {
        setLoading(true)
        const response = await postService.getAllPosts(page, size);
        setLoading(false)

        if (response.isSuccess) {
            setPagination(response.pagination)
            setPosts(prevPosts => {
                const existingIds = new Set(prevPosts.map(post => post.id));
                const newPosts = response.data.filter(post => !existingIds.has(post.id));
                return [...prevPosts, ...newPosts];
            });
        }
    }

    useEffect(() => {
        fetchPosts(pagination.page, pagination.size)
    }, [])

    const fetchNewPosts = async () => {
        fetchPosts(pagination.page + 1, pagination.size)
    }

    const handleCreatePostSuccess = (toastId: Id, msg: string) => {
        fetchNewPosts()
        toast.update(toastId, {
            render: msg,
            type: 'success',
            isLoading: false,
            autoClose: 3000,
        });
    }

    const handleCreatePostFailed = (toastId: Id, msg: string) => {
        toast.update(toastId, {
            render: msg,
            type: 'success',
            isLoading: false,
            autoClose: 3000,
        });
    }

    useEffect(() => {
        fetchPosts(pagination.page, pagination.size);

    }, []);


    return <div className="flex flex-col gap-y-4 pb-20">
        <PostCreator
            onSuccess={handleCreatePostSuccess}
            onFalied={handleCreatePostFailed}
        />

        {posts.map(post => {
            if (post.postType === PostType.SHARE_POST) {
                return <SharePost onFetch={() => fetchPosts(1, pagination.size)} key={post.id} post={post} />;
            }

            return <Post onFetch={() => fetchPosts(1, pagination.size)} key={post.id} post={post} />;
        })}

        {loading && <PostSkeletonList />} 
        {pagination.hasMore && !loading && <button onClick={fetchNewPosts} className="text-primary font-semibold text-center">Tải thêm bài viết</button>}
    </div>
};

export default Feeds;
