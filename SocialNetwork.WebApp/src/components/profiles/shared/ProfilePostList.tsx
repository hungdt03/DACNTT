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
import PostFilter, { ProfilePostFilter } from "../../posts/ProfilePostFilter";
import { Filter, FilterX } from "lucide-react";

type ProfilePostListProps = {
    user: UserResource;
}

const ProfilePostList: FC<ProfilePostListProps> = ({
    user
}) => {
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<PostResource[]>([]);
    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState<ProfilePostFilter>()

    useElementInfinityScroll({
        onLoadMore: () => void fetchNewPosts(),
        hasMore: pagination.hasMore,
        isLoading: loading,
        elementId: "my-profile-page",
    });


    const fetchPosts = async (page: number, size: number) => {
        setLoading(true)
        const response = await postService.getAllPostsByUserId(user.id, page, size, filter);
        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination);

            if(page === 1) {
                setPosts(response.data);
            } else {
                setPosts(prevPosts => {
                    const existingIds = new Set(prevPosts.map(post => post.id));
                    const newPosts = response.data.filter(post => !existingIds.has(post.id));
                    return [...prevPosts, ...newPosts];
                });
            }
        }
    }

    useEffect(() => {
        fetchPosts(1, 6)
    }, [filter])

    const fetchNewPosts = async () => {
        if (!pagination.hasMore || loading) return;
        fetchPosts(pagination.page + 1, pagination.size)
    }

    return <div className="col-span-12 lg:col-span-7 max-w-screen-sm mx-auto flex flex-col gap-y-4 pb-8">
        <div className="z-10 shadow sticky top-0 p-2 rounded-md border-[1px] bg-white flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-1">
                    <Filter size={18} />
                    <span className="text-[16px] font-bold">Bộ lọc</span>
                </div>
                {isFilter && <button onClick={() => {
                    fetchPosts(1, 6)
                    setIsFilter(false)
                }} className="py-1 px-2 hover:bg-gray-200 rounded-md bg-gray-100 flex items-center gap-x-1">
                    <FilterX size={18} />
                    <span>Bỏ lọc</span>
                </button>}
            </div>

            <PostFilter
                onChange={(filter) => {
                    setIsFilter(true);
                    setFilter(filter)
                }}
            />
        </div>

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
