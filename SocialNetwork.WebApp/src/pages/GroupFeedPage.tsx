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
import PostGroup from "../components/posts/PostGroup";


const GroupFeedPage: FC = () => {
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [posts, setPosts] = useState<PostResource[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const fetchPosts = async (page: number, size: number) => {
        setLoading(true);
        const response = await postService.getAllGroupPostsByCurrentUser(page, size);
        console.log(response)
        setTimeout(() => setLoading(false), 4000)

        if (response.isSuccess) {
            setPagination(response.pagination);
            setPosts(prevPosts => {
                const existingIds = new Set(prevPosts.map(post => post.id));
                const newPosts = response.data.filter(post => !existingIds.has(post.id));
                return [...prevPosts, ...newPosts];
            });
        }
    };

    useEffect(() => {
        fetchPosts(pagination.page, pagination.size);
    }, []);

    const handleRemovePost = (postId: string) => {
        setPosts(prevPosts => [...prevPosts.filter(p => p.id !== postId)])
    }

    const fetchNewPosts = async () => {
        if (!pagination.hasMore || loading) return;
        fetchPosts(pagination.page + 1, pagination.size);
    };

    const fetchPostByID = async (postId: string) => {
        const response = await postService.getPostById(postId);
        if (response.isSuccess) {
            setPosts(prevPosts => [response.data, ...prevPosts]);
        } else {
            toast.error(response.message);
        }
    };

    const handleCreatePostSuccess = (toastId: Id, msg: string, data: PostResource) => {
        fetchPostByID(data.id);
        toast.update(toastId, {
            render: msg,
            type: 'success',
            isLoading: false,
            autoClose: 3000,
        });
    };

    const handleCreatePostFailed = (toastId: Id, msg: string) => {
        toast.update(toastId, {
            render: msg,
            type: 'error',
            isLoading: false,
            autoClose: 3000,
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    fetchNewPosts();
                }
            },
            { root: containerRef.current, rootMargin: '100px' } // Tải trước khi user cuộn hẳn tới cuối
        );

        observerRef.current = observer;

        const triggerElement = document.getElementById('scroll-trigger');
        if (triggerElement) {
            observer.observe(triggerElement);
        }

        return () => {
            if (observerRef.current && triggerElement) {
                observer.unobserve(triggerElement);
            }
        };
    }, [pagination, loading]);

    return (
        <div className="w-full bg-gray-100 py-8 h-full overflow-y-auto custom-scrollbar">
            <div ref={containerRef} className="flex flex-col gap-y-4 pb-20 max-w-screen-sm mx-auto">
                {posts.map(post => {
                    if (post.postType === PostType.SHARE_POST) {
                        return <SharePost onRemovePost={handleRemovePost} onFetch={(data) => fetchPostByID(data.id)} key={post.id} post={post} />;
                    }

                    return <PostGroup key={post.id} post={post} />;
                })}

                {loading && <PostSkeletonList />}
                <div id="scroll-trigger" className="w-full h-1" />

                {!pagination.hasMore && !loading && (
                    <p className="text-center text-gray-500">Không còn bài viết để tải.</p>
                )}
            </div>
        </div>
    );
};

export default GroupFeedPage;