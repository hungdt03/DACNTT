import { FC, useEffect, useState } from "react";
import { UserResource } from "../../types/user";
import userService from "../../services/userService";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import BlockUser from "../BlockUser";
import { Empty, message } from "antd";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import LoadingIndicator from "../LoadingIndicator";

const BlockListModal: FC = () => {
    const [blockUsers, setBlockUsers] = useState<UserResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => fetchMore(),
        hasMore: pagination.hasMore,
        loading: loading,
        triggerId: 'block-users-scroll-trigger',
        rootMargin: '10px'
    })

    const fetchBlockUsers = async (page: number, size: number) => {
        setLoading(true)
        const response = await userService.getAllBlockUsers(page, size);
        setLoading(false)

        if (response.isSuccess) {
            setPagination(response.pagination)
            setBlockUsers(prevUsers => {
                const existingIds = new Set(prevUsers.map(user => user.id));
                const newUsers = response.data.filter(post => !existingIds.has(post.id));
                return [...prevUsers, ...newUsers];
            })
        }

    }

    const handleUnblockUser = async (userId: string) => {
        const response = await userService.unblockUser(userId);
        if (response.isSuccess) {
            message.success(response.message)
            setBlockUsers(prevUsers => [...prevUsers.filter(u => u.id !== userId)])
        } else {
            message.error(response.message)
        }
    }

    const fetchMore = () => {
        if (!pagination.hasMore || loading) return;

        fetchBlockUsers(pagination.page + 1, pagination.size)
    }

    useEffect(() => {
        fetchBlockUsers(pagination.page, pagination.size)
    }, [])

    return <div className="flex flex-col gap-y-8 max-h-[500px] overflow-hidden">
        <p className="text-gray-600 text-[15px]">Khi bạn chặn ai đó, họ sẽ không xem được nội dung bạn đăng trên dòng thời gian của mình, gắn thẻ bạn, mời bạn tham gia nhóm, bắt đầu cuộc trò chuyện với bạn hay thêm bạn làm bạn bè. </p>

        <div ref={containerRef} className="flex flex-col gap-y-2 h-full overflow-y-auto custom-scrollbar">
            {blockUsers.length > 0 && !loading ? blockUsers.map(user => <BlockUser unBlockUser={() => handleUnblockUser(user.id)} key={user.id} user={user} />) : !loading && <Empty description='Bạn chưa chặn ai' />}
            {loading && <LoadingIndicator />}
            <div id="block-users-scroll-trigger" className="w-full h-1"></div>
        </div>
    </div>
};

export default BlockListModal;
