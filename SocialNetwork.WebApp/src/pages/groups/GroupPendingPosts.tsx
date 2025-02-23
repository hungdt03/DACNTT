import { FC, useEffect, useState } from "react";
import PendingPost from "../../components/groups/components/PendingPost";
import { PostResource } from "../../types/post";
import postService from "../../services/postService";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useParams } from "react-router-dom";
import { Avatar, DatePicker, Dropdown, Empty, message } from "antd";
import { Search } from "lucide-react";
import groupService from "../../services/groupService";
import { GroupMemberResource } from "../../types/group-member";
import { Dayjs } from "dayjs";
import { UserResource } from "../../types/user";
import useDebounce from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import LoadingIndicator from "../../components/LoadingIndicator";
import { CONTENT_TYPES, ContentTypeKey, SORT_ORDER, SortOrderKey } from "../../utils/filter";

export type PendingPostsFilter = {
    date?: string;
    sortOrder: SortOrderKey;
    author?: UserResource;
    contentType?: ContentTypeKey;
}

type GroupPendingPostsProps = {
}

const GroupPendingPosts: FC<GroupPendingPostsProps> = ({
}) => {
    const { id } = useParams()
    const [pendingPosts, setPendingPosts] = useState<PostResource[]>([]);
    const [members, setMembers] = useState<GroupMemberResource[]>([]);
    const [searchValue, setSearchValue] = useState('')

    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    
    const [loading, setLoading] = useState(false);
    
    const [memberPagination, setMemberPagination] = useState<Pagination>(inititalValues);
    const [memberLoading, setMemberLoading] = useState(false);

    const [filter, setFilter] = useState<PendingPostsFilter>({
        sortOrder: 'asc',
    })

    const debouncedValue = useDebounce(searchValue, 300);

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchMoreMembers(),
        hasMore: memberPagination.hasMore,
        loading: memberLoading,
        rootMargin: "10px",
        triggerId: "select-member-scroll-trigger",
    });

    const fetchMembers = async (groupId: string, page: number, size: number) => {
        setMemberLoading(true);
        const response = await groupService.getAllMembersByGroupId(groupId, page, size);
        setMemberLoading(false);

        if (response.isSuccess) {
            setMemberPagination(response.pagination);
            setMembers(prevMembers => {
                const existingIds = new Set(prevMembers.map(m => m.user.id));
                const newMembers = response.data.filter(m => !existingIds.has(m.user.id));
                return [...prevMembers, ...newMembers];
            });
        }
    };

    const fetchMoreMembers = async () => {
        if (!memberPagination.hasMore || memberLoading || !id) return;
        fetchMembers(id, memberPagination.page + 1, memberPagination.size);
    };

    const fetchPendingPosts = async (groupId: string, page: number, size: number, query: string, filterParams: PendingPostsFilter) => {
        setLoading(true)
        const response = await postService.getAllPendingPostsByGroupId(groupId, page, size, query, filterParams);
        setLoading(false)
        if (response.isSuccess) {
            setPendingPosts(response.data);
            setPagination(response.pagination);
        }
    }

    useEffect(() => {
        id && fetchPendingPosts(id, pagination.page, pagination.size, searchValue, filter);
        id && fetchMembers(id, memberPagination.page, memberPagination.size);
    }, [id])

    const handleApprovalPost = async (postId: string) => {
        if (id) {
            const response = await postService.approvalPostByGroupIdAndPostId(id, postId);
            if (response.isSuccess) {
                message.success(response.message);
                fetchPendingPosts(id, 1, 6, searchValue, filter)
            } else {
                message.error(response.message)
            }
        }
    }

    const handleRejectPost = async (postId: string) => {
        if (id) {
            const response = await postService.rejectPostByGroupIdAndPostId(id, postId);
            if (response.isSuccess) {
                message.success(response.message);
                fetchPendingPosts(id, 1, 6, searchValue, filter)
            } else {
                message.error(response.message)
            }
        }
    }

    const handleMemberChange = (member: UserResource) => {
        const updateFilter = {
            ...filter,
            author: member
        }
        setFilter(updateFilter)
        id && fetchPendingPosts(id, 1, 6, searchValue, updateFilter)
    }

    const handleContentTypeClick = (key: ContentTypeKey) => {
        const updateFilter = {
            ...filter,
            contentType: key
        }
        setFilter(updateFilter)
        id && fetchPendingPosts(id, 1, 6, searchValue, updateFilter)
    };

    const handleSortOrderClick = (key: SortOrderKey) => {
        const updateFilter = {
            ...filter,
            sortOrder: key
        }
        setFilter(updateFilter)
        id && fetchPendingPosts(id, 1, 6, searchValue, updateFilter)
    };

    const handleChangeDate = (date: Dayjs, dateString: string | string[]) => {
        const updateFilter = {
            ...filter,
            date: dateString as string
        }
        setFilter(updateFilter)
        id && fetchPendingPosts(id, 1, 6, searchValue, updateFilter)
    }


    useEffect(() => {
        if ((debouncedValue.trim().length > 1 || debouncedValue.trim().length === 0) && id) {
            fetchPendingPosts(id, 1, 6, debouncedValue, filter)
        }
    }, [debouncedValue])

    return <div className="w-full">
        <div className="w-full flex items-center justify-center bg-white shadow sticky top-0 z-10 px-2">
            <div className="max-w-screen-lg w-full py-3 flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                    <span className="text-xl font-bold">Đang chờ phê duyệt</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="text-xl font-bold">{pendingPosts.length}</span>
                </div>
                <div className="flex items-center flex-wrap gap-y-2 gap-x-4">
                    <div className="px-4 flex items-center gap-x-2 rounded-3xl bg-gray-100">
                        <Search size={14} />
                        <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm" className="px-2 py-1 w-full bg-gray-100 outline-none border-none" />
                    </div>

                    <DatePicker placeholder="Chọn ngày" className="text-sm" onChange={handleChangeDate} />
                    <Dropdown
                        trigger={['click']}
                        dropdownRender={() => (
                            <div ref={containerRef} className="bg-white shadow-lg rounded-lg w-56 max-h-[400px] custom-scrollbar overflow-y-auto">
                                {members.map((member) => (
                                    <button
                                        key={member.user.id}
                                        onClick={() => handleMemberChange(member.user)}
                                        className="w-full py-2 px-4 flex items-center gap-x-2 hover:bg-gray-100 transition"
                                    >
                                        <Avatar size="small" src={member.user.avatar} />
                                        <span>{member.user.fullName}</span>
                                    </button>
                                ))}

                                <div id="select-member-scroll-trigger" className="w-full h-1" />

                                {memberLoading && (
                                    <LoadingIndicator />
                                )}
                            </div>
                        )}
                        placement="bottom"
                    >
                        {filter.author ? <button className="py-[6px] px-4 text-sm rounded-md bg-sky-100 text-primary font-semibold">
                            {filter.author.fullName}
                        </button> : <button className="py-[6px] px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">Chọn tác giả</button>}

                    </Dropdown>
                    <Dropdown
                        menu={{
                            items: CONTENT_TYPES.map(item => ({
                                key: item.key,
                                label: (
                                    <div className="py-1" onClick={() => handleContentTypeClick(item.key)}>
                                        {item.label}
                                    </div>
                                ),
                            })),
                        }}
                        placement="bottom"
                    >
                        {filter.contentType ? <button className="py-[6px] px-4 text-sm rounded-md bg-sky-100 text-primary font-semibold">
                            {CONTENT_TYPES.find(item => item.key === filter.contentType)?.label}
                        </button> : <button className="py-[6px] px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">Loại nội dung</button>}
                    </Dropdown>

                    <Dropdown
                        menu={{
                            items: SORT_ORDER.map(item => ({
                                key: item.key,
                                label: (
                                    <div className="py-1" onClick={() => handleSortOrderClick(item.key)}>
                                        {item.label}
                                    </div>
                                ),
                            })),
                        }}
                        placement="bottom"
                    >
                        {filter.sortOrder ? <button className="py-[6px] px-4 text-sm rounded-md bg-sky-100 text-primary font-semibold">
                            {SORT_ORDER.find(item => item.key === filter.sortOrder)?.label}
                        </button> : <button className="py-[6px] px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">Cũ nhất trước</button>}
                    </Dropdown>
                </div>

            </div>
        </div>

        {pendingPosts.length === 0 && !loading && <div className="w-full h-full flex items-center justify-center">
            <Empty description='Không có bài viết nào đang chờ phê duyệt' />
        </div>}

        <div className="w-full max-w-screen-lg mx-auto px-2 sm:px-0 grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {pendingPosts.map(post => <PendingPost
                onReject={() => handleRejectPost(post.id)}
                onApproval={() => handleApprovalPost(post.id)}
                key={post.id}
                post={post}
            />)}
        </div>

        {loading && <LoadingIndicator />}
    </div>
};

export default GroupPendingPosts;
