import { FC, useEffect, useState } from "react";
import { PostResource } from "../../types/post";
import postService from "../../services/postService";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import PostShareItem from "../posts/PostShareItem";
import { Empty } from "antd";

type ListSharePostModalProps = {
    post: PostResource
}

const ListSharePostModal: FC<ListSharePostModalProps> = ({
    post
}) => {
    const [sharePosts, setSharePosts] = useState<PostResource[]>([])
    const [pagination, setPagination] = useState<Pagination>(inititalValues);

    const fetchShares = async (page: number, size: number) => {
        const response = await postService.getAllSharesByPostId(post.id, page, size);
        if (response.isSuccess) {
            setSharePosts(response.data)
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchShares(pagination.page, pagination.size)
    }, [post])

    return <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {sharePosts.length === 0 ? <Empty description='Chưa có lượt chia sẻ nào' />
        : <div className="flex flex-col gap-y-3">
            {sharePosts.map(sharePost => <PostShareItem key={sharePost.id} post={sharePost} />)}
        </div>}
    </div>
};

export default ListSharePostModal;
