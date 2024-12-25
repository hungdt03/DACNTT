import { FC, useEffect, useRef, useState } from "react";
import Post from "../components/posts/Post";
import PostCreator from "../components/posts/PostCreator";
import { Id, toast } from "react-toastify";
import { PostResource } from "../types/post";
import postService from "../services/postService";
import { PostType } from "../enums/post-type";
import SharePost from "../components/posts/SharePost";
import PostSkeletonList from "../components/skeletons/PostSkeletonList";
import { Pagination } from "../types/response";
import { inititalValues } from "../utils/pagination";
import StoryWrapper from "../components/story/StoryWrapper";

const Feeds: FC = () => {
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [posts, setPosts] = useState<PostResource[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

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

        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [])

    const fetchNewPosts = async () => {
        fetchPosts(pagination.page + 1, pagination.size)
    }

    const fetchPostByID = async (postId: string) => {
        const response = await postService.getPostById(postId);
        if(response.isSuccess) {
            setPosts(prevPosts => [response.data, ...prevPosts])
        } else {
            toast.error(response.message)
        }
    }

    const handleCreatePostSuccess = (toastId: Id, msg: string, data: PostResource) => {
        fetchPostByID(data.id)
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

    return <div ref={containerRef} className="flex flex-col gap-y-4 pb-20">
        <PostCreator
            onSuccess={handleCreatePostSuccess}
            onFalied={handleCreatePostFailed}
        />

        <StoryWrapper />

        {posts.map(post => {
            if (post.postType === PostType.SHARE_POST) {
                return <SharePost onFetch={(data) => fetchPostByID(data.id)} key={post.id} post={post} />;
            }

            return <Post onFetch={(data) => fetchPostByID(data.id)} key={post.id} post={post} />;
        })}

        {loading && <PostSkeletonList />} 
        {pagination.hasMore && !loading && <button onClick={fetchNewPosts} className="text-primary font-semibold text-center">Tải thêm bài viết</button>}
    </div>
};

export default Feeds;
