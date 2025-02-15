import { FC, useEffect, useState } from "react";
import PostGroupCreator from "../posts/PostGroupCreator";
import { Id, toast } from "react-toastify";
import { PostResource } from "../../types/post";
import postService from "../../services/postService";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import PostSkeletonList from "../skeletons/PostSkeletonList";
import Post from "../posts/Post";
import { GroupResource } from "../../types/group";
import { GroupPrivacy } from "../../enums/group-privacy";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

type GroupPostListProps = {
    group: GroupResource;
    onFetchGroup: () => void
}

const GroupPostList: FC<GroupPostListProps> = ({
    group,
    onFetchGroup
}) => {
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [posts, setPosts] = useState<PostResource[]>([]);

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchNewPosts(),
        hasMore: pagination.hasMore,
        loading,
        rootMargin: "50px",
        triggerId: "group-post-scroll-trigger",
    });

    const fetchPosts = async (page: number, size: number) => {
        setLoading(true);
        const response = await postService.getAllPostsByGroupId(group.id, page, size);
        setTimeout(() => setLoading(false), 1000)

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
        if(data) {
            fetchPostByID(data.id);
        }   
       
        toast.update(toastId, {
            render: msg,
            type: 'success',
            isLoading: false,
            autoClose: 3000,
        });
    };

    const handleCreatePostFailed = (toastId: Id, msg: string) => {
        onFetchGroup()
        toast.update(toastId, {
            render: msg,
            type: 'error',
            isLoading: false,
            autoClose: 3000,
        });
    };

    return <div className="col-span-12 lg:col-span-7 h-full overflow-y-auto scrollbar-hide py-2 md:py-6">
        <div ref={containerRef} className="flex flex-col gap-y-2 md:gap-y-4">
            {(group.onlyAdminCanPost && group.isMine) || !group.onlyAdminCanPost && <PostGroupCreator onFalied={handleCreatePostFailed} onSuccess={handleCreatePostSuccess} group={group} />}
            {posts.map(post => {
                return <Post onRemovePost={() => handleRemovePost(post.id)} group={group} key={post.id} post={post} allowShare={group.privacy === GroupPrivacy.PUBLIC} />
            })}

            {loading && <PostSkeletonList />}
            <div id="group-post-scroll-trigger" className="w-full h-1" />

            {!pagination.hasMore && !loading && posts.length > 0 && (
                <p className="text-center text-gray-500 pb-6 text-sm md:text-[15px]">Không còn bài viết để tải.</p>
            )}

            {posts.length === 0 && !loading && <p className="text-center text-sm md:text-[15px] text-gray-500">Không có bài viết để tải</p>}
        </div>
    </div>
};

export default GroupPostList;
