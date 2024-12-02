import { FC, useEffect, useState } from "react";
import Post from "../components/posts/Post";
import PostCreator from "../components/posts/PostCreator";
import { Id, toast } from "react-toastify";
import { PostResource } from "../types/post";
import postService from "../services/postService";
import PostSkeleton from "../components/skeletons/PostSkeleton";
import { PostType } from "../constants/post-type";
import SharePost from "../components/posts/SharePost";

const Feeds: FC = () => {
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<PostResource[]>([]);

    const fetchPosts = async () => {
        setLoading(true)
        const response = await postService.getAllPosts();
        setLoading(false)

        if (response.isSuccess) {
            setPosts(response.data)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handleCreatePostSuccess = (toastId: Id, msg: string) => {
        fetchPosts();
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

    return <div className="flex flex-col gap-y-4 pb-20">
        <PostCreator
            onSuccess={handleCreatePostSuccess}
            onFalied={handleCreatePostFailed}
        />
       
        {loading ? <PostSkeleton /> : posts.map(post => {
            if(post.postType === PostType.SHARE_POST) {
                return <SharePost onFetch={fetchPosts} key={post.id} post={post} />
            }

            return <Post onFetch={fetchPosts} key={post.id} post={post} />
        })}
    </div>
};

export default Feeds;
