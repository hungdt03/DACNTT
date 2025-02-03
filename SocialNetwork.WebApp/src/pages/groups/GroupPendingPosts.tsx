import { FC, useEffect, useState } from "react";
import PendingPost from "../../components/groups/components/PendingPost";
import { PostResource } from "../../types/post";
import postService from "../../services/postService";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useParams } from "react-router-dom";
import { Avatar, DatePicker, Dropdown, MenuProps, message } from "antd";
import { Search } from "lucide-react";
import groupService from "../../services/groupService";
import { GroupMemberResource } from "../../types/group-member";
import { Dayjs } from "dayjs";
import { UserResource } from "../../types/user";

type ContentTypeKey = 'media' | 'text' | 'background' | 'share';
type SortOrderKey = 'asc' | 'desc';

interface ContentType {
    key: ContentTypeKey;
    label: string;
}

interface SortOrder {
    key: SortOrderKey;
    label: string;
}

const CONTENT_TYPES: ContentType[] = [
    { key: 'media', label: 'Ảnh/video' },
    { key: 'text', label: 'Văn bản' },
    { key: 'background', label: 'Phông nền' },
    { key: 'share', label: 'Chia sẻ lại' },
];

const SORT_ORDER: SortOrder[] = [
    { key: 'asc', label: 'Cũ nhất trước' },
    { key: 'desc', label: 'Mới nhất trước' },
];


export type PendingPostsFilter = {
    date?: Dayjs;
    sortOrder: 'asc' | 'desc',
    author?: UserResource;
    contentType?: 'media' | 'text' | 'background' | 'share'
}

type GroupPendingPostsProps = {
}

const GroupPendingPosts: FC<GroupPendingPostsProps> = ({
}) => {
    const { id } = useParams()
    const [pendingPosts, setPendingPosts] = useState<PostResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState<GroupMemberResource[]>([]);
    const [filter, setFilter] = useState<PendingPostsFilter>({
        sortOrder: 'asc'
    })

    const fetchPendingPosts = async (groupId: string, page: number, size: number) => {
        setLoading(true)
        const response = await postService.getAllPendingPostsByGroupId(groupId, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setPendingPosts(response.data);
            setPagination(response.pagination);
        }
    }

    const fetchMembers = async () => {
        if (id) {
            const response = await groupService.getAllMembersByGroupId(id);
            if (response.isSuccess) {
                setMembers(response.data)
            }
        }
    }

    useEffect(() => {
        id && fetchPendingPosts(id, pagination.page, pagination.size);
        fetchMembers();
    }, [id])

    const handleApprovalPost = async (postId: string) => {
        if (id) {
            const response = await postService.approvalPostByGroupIdAndPostId(id, postId);
            if (response.isSuccess) {
                message.success(response.message);
                fetchPendingPosts(id, 1, 6)
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
                fetchPendingPosts(id, 1, 6)
            } else {
                message.error(response.message)
            }
        }
    }

    const handleMemberChange = (member: UserResource) => {
        setFilter(prev => ({
            ...prev,
            author: member
        }))
    }

    const handleContentTypeClick = (key: ContentTypeKey) => {
        setFilter(prev => ({
            ...prev,
            contentType: key
        }))
    };

    const handleSortOrderClick = (key: SortOrderKey) => {
        setFilter(prev => ({
            ...prev,
            sortOrder: key
        }))
    };


    return <div className="w-full">
        <div className="w-full flex items-center justify-center bg-white shadow sticky top-0 z-10">
            <div className="max-w-screen-sm w-full py-8 flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                    <span className="text-xl font-bold">Đang chờ phê duyệt</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="text-xl font-bold">2</span>
                </div>
                <div className="px-4 flex items-center gap-x-2 rounded-3xl bg-gray-100">
                    <Search size={14} />
                    <input placeholder="Tìm kiếm" className="px-2 py-2 w-full bg-gray-100 outline-none border-none" />
                </div>

                <div className="flex items-center gap-x-4">
                    <DatePicker placeholder="Chọn ngày" className="text-sm" />
                    <Dropdown menu={{
                        items: members.map(member => ({
                            label: <button
                                onClick={() => handleMemberChange(member.user)}
                                className="py-1 flex items-center gap-x-2">
                                <Avatar
                                    size={'small'}
                                    src={member.user.avatar}
                                />
                                <span>{member.user.fullName}</span>
                            </button>,
                            key: member.user.id
                        }))
                    }} placement="bottom">
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

        <div className="grid grid-cols-2 gap-4 py-4 px-8">
            {pendingPosts.map(post => <PendingPost
                onReject={() => handleRejectPost(post.id)}
                onApproval={() => handleApprovalPost(post.id)}
                key={post.id}
                post={post}
            />)}
        </div>
    </div>
};

export default GroupPendingPosts;
