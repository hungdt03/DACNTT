import { FC, useEffect, useState } from "react";
import Post from "../posts/Post";
import PostCreator from "../posts/PostCreator";
import { PostResource } from "../../types/post";
import postService from "../../services/postService";
import { Id, toast } from "react-toastify";
import { PostType } from "../../enums/post-type";
import SharePost from "../posts/SharePost";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { UserResource } from "../../types/user";
import PostSkeletonList from "../skeletons/PostSkeletonList";
import PostGroup from "../posts/PostGroup";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

type ProfilePostListProps = {
    isShowPostCreator?: boolean;
    user: UserResource;
}

const ProfilePostList: FC<ProfilePostListProps> = ({
    isShowPostCreator = true,
    user
}) => {
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<PostResource[]>([]);

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchNewPosts(),
        hasMore: pagination.hasMore,
        loading,
        rootMargin: "100px",
        triggerId: "profile-post-scroll-trigger",
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

    const handleCreatePostSuccess = (toastId: Id, msg: string) => {
        fetchNewPosts();
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

    return <div ref={containerRef} className="col-span-12 lg:col-span-7 max-w-screen-sm mx-auto flex flex-col gap-y-4">
        {isShowPostCreator && <PostCreator
            onSuccess={handleCreatePostSuccess}
            onFalied={handleCreatePostFailed}
        />}

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
        {!pagination.hasMore && !loading && (
            <p className="text-center text-gray-500">Không còn bài viết để tải.</p>
        )}
    </div>
};

export default ProfilePostList;
