import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PostResource } from "../../types/post";
import postService from "../../services/postService";
import { PostType } from "../../enums/post-type";
import SharePost from "../../components/posts/SharePost";
import PostSkeletonList from "../../components/skeletons/PostSkeletonList";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import PostGroup from "../../components/posts/PostGroup";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { PrivacyType } from "../../enums/privacy";


const GroupFeedSharedPage: FC = () => {
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [posts, setPosts] = useState<PostResource[]>([]);

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchNewPosts(),
        hasMore: pagination.hasMore,
        loading,
        rootMargin: "100px",
        triggerId: "share-group-post-scroll-trigger",
    });


    const fetchPosts = async (page: number, size: number) => {
        setLoading(true);
        const response = await postService.getAllGroupPostsByCurrentUser(page, size);
        setLoading(false);
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

    return (
        <div className="w-full bg-gray-100 lg:py-8 pb-8 px-1 sm:px-0 h-full overflow-y-auto custom-scrollbar">
            <div ref={containerRef} className="flex flex-col gap-y-4 max-w-screen-sm mx-auto">
                {posts.map(post => {
                    if (post.postType === PostType.SHARE_POST) {
                        return <SharePost onRemovePost={handleRemovePost} onFetch={(data) => fetchPostByID(data.id)} key={post.id} post={post} />;
                    }

                    return <PostGroup allowShare={post.privacy === PrivacyType.GROUP_PUBLIC} key={post.id} post={post} />;
                })}

                {loading && <PostSkeletonList />}
                <div id="share-group-post-scroll-trigger" className="w-full h-1" />

                {posts.length > 0 && !pagination.hasMore && !loading && (
                    <p className="text-center text-gray-500">Không còn bài viết để tải.</p>
                )}

                {posts.length === 0 && !loading && (
                    <p className="text-center text-gray-500">Không có bài viết nào để tải.</p>
                )}
            </div>
        </div>
    );
};

export default GroupFeedSharedPage;