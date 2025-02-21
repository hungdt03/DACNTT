import { FC, useEffect, useState } from "react";
import { PostResource } from "../../../types/post";
import { inititalValues } from "../../../utils/pagination";
import postService from "../../../services/postService";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import PostSkeletonList from "../../skeletons/PostSkeletonList";
import SharePost from "../../posts/SharePost";
import PostGroup from "../../posts/PostGroup";
import { PostType } from "../../../enums/post-type";
import Post from "../../posts/Post";
import { PrivacyType } from "../../../enums/privacy";

const ProfileSavedPost: FC = () => {
    const [savedPosts, setSavedPosts] = useState<PostResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(inititalValues);


    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchMore(),
        hasMore: pagination.hasMore,
        loading,
        rootMargin: "100px",
        triggerId: "saved-post-scroll-trigger",
    });


    const fetchSavedPosts = async (page: number, size: number) => {
        setLoading(true)
        const response = await postService.getUserSavedPosts(page, size);
        setLoading(false);
        if (response.isSuccess) {
            setPagination(response.pagination);
            setSavedPosts(prevPosts => {
                const existingIds = new Set(prevPosts.map(post => post.id));
                const newPosts = response.data.filter(post => !existingIds.has(post.id));
                return [...prevPosts, ...newPosts];
            });
        }
    }

    useEffect(() => {
        fetchSavedPosts(pagination.page, pagination.size);
    }, []);

    const handleRemoveSavedPost = (postId: string) => {
        setSavedPosts(prevPosts => [...prevPosts.filter(p => p.id !== postId)])
    }

    const fetchMore = async () => {
        if (!pagination.hasMore || loading) return;
        fetchSavedPosts(pagination.page + 1, pagination.size);
    };


    return <div ref={containerRef} className="mx-auto max-w-screen-sm flex flex-col gap-y-4 pb-20">
        {savedPosts.map(post => {
            if (post.postType === PostType.SHARE_POST) {
                return <SharePost onRemoveSavedPost={handleRemoveSavedPost} allowShare={post.privacy === PrivacyType.PUBLIC} key={post.id} post={post} />;
            } else if (post.isGroupPost) {
                return <PostGroup onRemoveSavedPost={handleRemoveSavedPost} allowShare={post.privacy === PrivacyType.GROUP_PUBLIC} key={post.id} post={post} />;
            }

            return <Post onRemoveSavedPost={handleRemoveSavedPost} allowShare={post.privacy === PrivacyType.PUBLIC} key={post.id} post={post} />;
        })}

        {loading && <PostSkeletonList />}
        <div id="saved-post-scroll-trigger" className="w-full h-1" />

        {!pagination.hasMore && !loading && (
            <p className="text-center text-gray-500">Không còn bài viết để tải.</p>
        )}
    </div>
};

export default ProfileSavedPost;
