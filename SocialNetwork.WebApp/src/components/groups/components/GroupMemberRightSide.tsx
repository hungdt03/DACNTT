import { FC, useEffect, useState } from "react";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { PostResource } from "../../../types/post";
import postService from "../../../services/postService";
import { GroupResource } from "../../../types/group";
import { toast } from "react-toastify";
import Post from "../../posts/Post";
import PostSkeletonList from "../../skeletons/PostSkeletonList";
import { GroupPrivacy } from "../../../enums/group-privacy";
import { GroupMemberResource } from "../../../types/group-member";
import { useElementInfinityScroll } from "../../../hooks/useElementInfinityScroll";

type GroupMemberRightSideProps = {
    group: GroupResource;
    member: GroupMemberResource;
}

const GroupMemberRightSide: FC<GroupMemberRightSideProps> = ({
    group,
    member
}) => {
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [posts, setPosts] = useState<PostResource[]>([]);

    const fetchPosts = async (page: number, size: number) => {
        setLoading(true);
        const response = await postService.getAllMemberPostsInGroup(member.id, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination);
            setPosts(prevPosts => {
                const existingIds = new Set(prevPosts.map(post => post.id));
                const newPosts = response.data.filter(post => !existingIds.has(post.id));
                return [...prevPosts, ...newPosts];
            });
        }
    };

    const fetchNextPage = () => {
        if(!pagination.hasMore || loading) return;
        fetchPosts(pagination.page + 1, pagination.size);
    }

    useElementInfinityScroll({
        elementId: "group-member-detail",
        onLoadMore: fetchNextPage,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });

    useEffect(() => {
        fetchPosts(pagination.page, pagination.size);
    }, [member]);

    const handleRemovePost = (postId: string) => {
        setPosts(prevPosts => [...prevPosts.filter(p => p.id !== postId)])
    }


    const fetchPostByID = async (postId: string) => {
        const response = await postService.getPostById(postId);
        if (response.isSuccess) {
            setPosts(prevPosts => [response.data, ...prevPosts]);
        } else {
            toast.error(response.message);
        }
    };

    return <div id="group-member-detail" className="col-span-7 h-full overflow-y-auto scrollbar-hide flex flex-col gap-y-2 lg:gap-y-4">
        <div className="p-4 rounded-md bg-white shadow sticky top-0 z-10">
            <span className="text-lg font-bold">Bài viết trong nhóm</span>
        </div>

        <div  className="flex flex-col gap-y-2 lg:gap-y-4">
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

export default GroupMemberRightSide;
