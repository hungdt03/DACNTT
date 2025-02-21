import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GroupResource } from "../../../types/group";
import { PostResource } from "../../../types/post";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { useElementInfinityScroll } from "../../../hooks/useElementInfinityScroll";
import postService from "../../../services/postService";
import { toast } from "react-toastify";
import groupService from "../../../services/groupService";
import Post from "../../../components/posts/Post";
import { GroupPrivacy } from "../../../enums/group-privacy";
import LoadingIndicator from "../../../components/LoadingIndicator";

const GroupMyPendingPostPage: FC = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<GroupResource>();

    const fetchGroup = async () => {
        if (id) {
            const response = await groupService.getGroupById(id);
            if (response.isSuccess) {
                setGroup(response.data)
            }
        }
    }

    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [posts, setPosts] = useState<PostResource[]>([]);


    const fetchPosts = async (page: number, size: number) => {
        if (id) {
            setLoading(true);
            const response = await postService.getAllMyPendingPostsByGroupId(id, page, size);
            setLoading(false)

            if (response.isSuccess) {
                setPagination(response.pagination);
                setPosts(prevPosts => {
                    const existingIds = new Set(prevPosts.map(post => post.id));
                    const newPosts = response.data.filter(post => !existingIds.has(post.id));
                    return [...prevPosts, ...newPosts];
                });
            }
        }
    };

    useEffect(() => {
        fetchGroup();
        fetchPosts(pagination.page, pagination.size);
    }, [id]);

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


    useElementInfinityScroll({
        elementId: "my-approval-post",
        onLoadMore: () => fetchNewPosts,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });


    return <div id="my-approval-post" className="flex flex-col gap-y-2 md:gap-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-4">
            {posts.map(post => {
                return <Post isShowMore={false} isShowInteraction={false} onFetch={() => fetchPostByID(post.id)} onRemovePost={() => handleRemovePost(post.id)} group={group} key={post.id} post={post} allowShare={group?.privacy === GroupPrivacy.PUBLIC} />
            })}
        </div>

        {loading && <LoadingIndicator />}

        {!pagination.hasMore && !loading && posts.length > 0 && (
            <p className="text-center text-gray-500 pb-6 text-sm md:text-[15px]">Không còn bài viết để tải.</p>
        )}

        {posts.length === 0 && !loading && <p className="text-center text-sm md:text-[15px] text-gray-500">Không có bài viết để tải</p>}
    </div>
};

export default GroupMyPendingPostPage;
