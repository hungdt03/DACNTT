import { FC, useEffect, useState } from "react";
import Post from "../posts/Post";
import PostCreator from "../posts/PostCreator";
import { PostResource } from "../../types/post";
import postService from "../../services/postService";
import { Id, toast } from "react-toastify";
import PostSkeleton from "../skeletons/PostSkeleton";
import { PostType } from "../../constants/post-type";
import SharePost from "../posts/SharePost";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";

type ProfilePostListProps = {
    isShowPostCreator?: boolean
}

const ProfilePostList: FC<ProfilePostListProps> = ({
    isShowPostCreator = true
}) => {
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<PostResource[]>([]);

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

    return <div className="col-span-12 lg:col-span-7 flex flex-col gap-y-4">
        {isShowPostCreator && <PostCreator
            onSuccess={handleCreatePostSuccess}
            onFalied={handleCreatePostFailed}
        />}
       
        {loading ? <PostSkeleton /> : posts.map(post => {
            if(post.postType === PostType.SHARE_POST) {
                return <SharePost onFetch={fetchNewPosts} key={post.id} post={post} />
            }

            return <Post onFetch={fetchNewPosts} key={post.id} post={post} />
        })}
    </div>
};

export default ProfilePostList;
