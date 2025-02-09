import { FC, useEffect, useState } from "react";
import Post from "../../posts/Post";
import { PostResource } from "../../../types/post";
import postService from "../../../services/postService";
import { PostType } from "../../../enums/post-type";
import SharePost from "../../posts/SharePost";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { UserResource } from "../../../types/user";
import PostSkeletonList from "../../skeletons/PostSkeletonList";
import PostGroup from "../../posts/PostGroup";
import { Empty } from "antd";
import { useElementInfinityScroll } from "../../../hooks/useElementInfinityScroll";

type ProfilePostListProps = {
    user: UserResource;
}

const ProfilePostList: FC<ProfilePostListProps> = ({
    user
}) => {
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<PostResource[]>([]);

    useElementInfinityScroll({
        onLoadMore: () => void fetchNewPosts(),
        hasMore: pagination.hasMore,
        isLoading: loading,
        elementId: "my-profile-page",
    });


    const fetchPosts = async (page: number, size: number) => {
        setLoading(true)
        const response = await postService.getAllPostsByUserId(user.id, page, size);
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

    return <div className="col-span-12 lg:col-span-7 max-w-screen-sm mx-auto flex flex-col gap-y-4">
        {posts.map(post => {
            if (post.postType === PostType.SHARE_POST) {
                return <SharePost onFetch={() => fetchPosts(1, pagination.size)} key={post.id} post={post} />;
            } else if (post.isGroupPost) {
                return <PostGroup onFetch={() => fetchPosts(1, pagination.size)} key={post.id} post={post} />;
            }

            return <Post onFetch={() => fetchPosts(1, pagination.size)} key={post.id} post={post} />;
        })}

        {loading && <PostSkeletonList />}
        <div id="profile-post-scroll-trigger" className="w-full h-1" />

        {!loading && posts.length === 0 && (
            <Empty description='Không có bài viết để tải' />
        )}

        {!pagination.hasMore && !loading && posts.length > 0 && (
            <p className="text-center text-gray-500">Không còn bài viết để tải.</p>
        )}
    </div>
};

export default ProfilePostList;
