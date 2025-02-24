import { Table, TableProps, Space, DatePicker, Dropdown, Tag, Tooltip, Button, Popconfirm, message, Avatar } from "antd";
import { FC, useEffect, useState } from "react";
import { PostResource } from "../../../types/post";
import { CONTENT_TYPES, ContentTypeKey, SORT_ORDER, SortOrderKey } from "../../../utils/filter";
import { Eye, Filter, FilterX, Search, Trash } from "lucide-react";
import adminService from "../../../services/adminService";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { Dayjs } from "dayjs";
import { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { GroupMemberResource } from "../../../types/group-member";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { UserResource } from "../../../types/user";
import groupService from "../../../services/groupService";
import LoadingIndicator from "../../../components/LoadingIndicator";

const { RangePicker } = DatePicker;

export type PostTabQueryFilter = {
    search: string;
    author?: UserResource;
    fromDate?: string;
    toDate?: string;
    sortOrder: SortOrderKey;
    contentType?: ContentTypeKey;
}

type GroupPostTabsProps = {
    groupId: string;
}

const GroupPostTabs: FC<GroupPostTabsProps> = ({
    groupId
}) => {
    const [filter, setFilter] = useState<PostTabQueryFilter>({
        sortOrder: "desc",
        contentType: 'ALL',
        search: '',
        author: undefined
    });

    const [posts, setPosts] = useState<PostResource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);

    // MEMBER LIST
    const [members, setMembers] = useState<GroupMemberResource[]>([])
    const [memberPagination, setMemberPagination] = useState<Pagination>(inititalValues);
    const [memberLoading, setMemberLoading] = useState(false);

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchMoreMembers(),
        hasMore: memberPagination.hasMore,
        loading: memberLoading,
        rootMargin: "10px",
        triggerId: "select-member-tab-scroll-trigger",
    });

    const fetchMembers = async (page: number, size: number) => {
        if (groupId) {
            setMemberLoading(true);
            const response = await adminService.getAllMembersByGroupId(groupId, page, size);
            setMemberLoading(false);

            if (response.isSuccess) {
                setMemberPagination(response.pagination);
                setMembers(prevMembers => {
                    const existingIds = new Set(prevMembers.map(m => m.user.id));
                    const newMembers = response.data.filter(m => !existingIds.has(m.user.id));
                    return [...prevMembers, ...newMembers];
                });
            }
        }
    };

    const fetchMoreMembers = async () => {
        if (!memberPagination.hasMore || memberLoading) return;
        fetchMembers(memberPagination.page + 1, memberPagination.size);
    };

    const handleMemberChange = (member: UserResource) => {
        const updateFilter = {
            ...filter,
            author: member
        }
        setFilter(updateFilter)
        fetchPosts(1, 6, updateFilter)
    }

    const fetchPosts = async (page: number, size: number, filter: PostTabQueryFilter) => {
        setLoading(true)
        const response = await adminService.getAllPostsByGroupId(groupId, page, size, filter);
        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination)
            if (page === 1) {
                setPosts(response.data)
            } else {
                setPosts(prev => {
                    const newPosts = response.data.filter(newPost =>
                        !prev.some(existingPost => existingPost.id === newPost.id)
                    );
                    return [...prev, ...newPosts];
                });
            }
        }
    }

    useEffect(() => {
        fetchPosts(1, pagination.size, filter)
        fetchMembers(1, 6)
    }, []);

    const handleDeletePost = async (postId: string) => {
        const response = await adminService.DeleteOnePost(postId);
        if (response.isSuccess) {
            message.success(response.message);
            fetchPosts(pagination.page, pagination.size, filter)
        } else {
            message.error(response.message)
        }
    }

    const handleDeleteMany = async (postIds: string[]) => {
        const response = await adminService.DeleteManyPost(postIds);
        if (response.isSuccess) {
            message.success(response.message);
            setSelectedRowKeys([])
            fetchPosts(1, 6, filter)
        } else {
            message.error(response.message)
        }
    }


    const handleContentTypeChange = (key: ContentTypeKey) => {
        const updatedFilter = { ...filter, contentType: key };
        setFilter(updatedFilter);
        fetchPosts(1, pagination.size, updatedFilter)
    };

    const handleSortOrderChange = (key: SortOrderKey) => {
        const updatedFilter = { ...filter, sortOrder: key };
        setFilter(updatedFilter);
        fetchPosts(1, pagination.size, updatedFilter)
    };

    const handleChangeDate = (dates: (Dayjs | null)[] | null, dateStrings: [string, string]) => {
        const updateFilter = {
            ...filter,
            fromDate: dateStrings[0] || undefined, // Nếu rỗng thì bỏ qua
            toDate: dateStrings[1] || undefined,
        };
        setFilter(updateFilter);
        fetchPosts(1, pagination.size, updateFilter)
    };

    const handleClearFilter = () => {
        const initFiler = {
            ...filter,
            sortOrder: "desc",
            contentType: 'ALL',
            search: '',
            fromDate: undefined,
            toDate: undefined,
            author: undefined
        } as PostTabQueryFilter

        setFilter(initFiler)

        fetchPosts(1, 6, initFiler)
    }


    const columns: TableProps<PostResource>['columns'] = [
        {
            title: 'Tác giả',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => <div className="flex items-center gap-x-2">
                <Avatar size={'small'} src={record.user.avatar} />
                <span>{record.user.fullName}</span>
            </div>,
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            width: 200,
            render: (value) => (
                <Tooltip title={value}>
                    <p className="w-[200px] truncate whitespace-nowrap overflow-hidden">{value}</p>
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/admin/posts/${record.id}`}>
                        <Button type="primary" size="small" icon={<Eye size={14} />}>Chi tiết</Button>
                    </Link>
                    <Popconfirm onConfirm={() => handleDeletePost(record.id)} okText='Chắc chắn' cancelText='Hủy bỏ' title='Xóa' description='Bạn có chắc là muốn xóa bài viết này'>
                        <Button icon={<Trash size={14} />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<PostResource> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return <div className="flex flex-col gap-4 h-full">
        <div className="z-10 flex items-start gap-x-4 justify-between bg-white p-4 rounded-md shadow">
            <div className="flex items-center gap-x-1 flex-shrink-0">
                <Filter size={18} />
                <span className="text-[16px] font-bold">Bộ lọc</span>
            </div>

            <div className="flex items-center flex-wrap gap-y-2 gap-x-4 bg-white z-4">
                {/* Input Tìm kiếm */}
                <div className="px-4 flex items-center gap-x-2 rounded-lg bg-gray-100">
                    <Search size={14} />
                    <input
                        value={filter.search}
                        onChange={(e) => {
                            const updatedFilter = { ...filter, search: e.target.value };
                            setFilter(updatedFilter);
                            fetchPosts(1, pagination.size, updatedFilter)
                        }}

                        placeholder="Tìm kiếm"
                        className="px-2 py-2 text-sm w-full bg-gray-100 outline-none border-none"
                    />
                </div>

                <Dropdown
                    trigger={['click']}
                    dropdownRender={() => (
                        <div ref={containerRef} className="bg-white z-10 shadow-lg rounded-lg w-56 max-h-[400px] custom-scrollbar overflow-y-auto">
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

                            <div id="select-member-tab-scroll-trigger" className="w-full h-1" />

                            {memberLoading && (
                                <LoadingIndicator />
                            )}
                        </div>
                    )}
                    placement="bottom"
                >
                    {filter.author ? <button className="flex items-center gap-x-3 py-[6px] px-4 text-sm rounded-md bg-sky-100 text-primary font-semibold">
                        {filter.author.fullName}
                        <FontAwesomeIcon className="text-gray-500" icon={faCaretDown} />
                    </button> : <button className="flex items-center gap-x-3 py-[6px] px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                        Chọn tác giả
                        <FontAwesomeIcon className="text-gray-500" icon={faCaretDown} />
                    </button>}

                </Dropdown>


                {/* Dropdown Chọn Loại Nội Dung */}
                <Dropdown
                    menu={{
                        items: CONTENT_TYPES.map((item) => ({
                            key: item.key,
                            label: item.label,
                            onClick: () => handleContentTypeChange(item.key),
                        })),
                    }}
                    placement="bottom"
                >
                    <button className="py-[6px] flex items-center gap-x-3 px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                        {filter.contentType
                            ? CONTENT_TYPES.find((item) => item.key === filter.contentType)?.label
                            : "Loại nội dung"}
                        <FontAwesomeIcon className="text-gray-500" icon={faCaretDown} />
                    </button>
                </Dropdown>

                {/* Dropdown Chọn Thứ Tự Sắp Xếp */}
                <Dropdown
                    menu={{
                        items: SORT_ORDER.map((item) => ({
                            key: item.key,
                            label: item.label,
                            onClick: () => handleSortOrderChange(item.key),
                        })),
                    }}
                    placement="bottom"
                >
                    <button className="py-[6px] flex items-center gap-x-3 px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                        {SORT_ORDER.find((item) => item.key === filter.sortOrder)?.label ?? "Cũ nhất trước"}
                        <FontAwesomeIcon className="text-gray-500" icon={faCaretDown} />
                    </button>
                </Dropdown>

                {/* Chọn Ngày */}
                <RangePicker
                    onChange={handleChangeDate}
                    placeholder={["Từ ngày", "Đến ngày"]}
                    variant="borderless"
                    rootClassName="rounded-md bg-gray-100 hover:bg-gray-200"
                />

                <button onClick={handleClearFilter} className="flex-shrink-0 py-1 px-2 hover:bg-gray-200 rounded-md bg-gray-100 flex items-center gap-x-1">
                    <FilterX size={18} />
                    <span>Bỏ lọc</span>
                </button>
            </div>

        </div>
        <div className="p-4 flex flex-col gap-y-2 shadow rounded-md bg-white">
            <div className="flex items-center justify-between">
                <span className="text-[15px]">{hasSelected ? `Đã chọn ${selectedRowKeys.length} dòng` : null}</span>

                <div className="flex items-center gap-x-2">
                    <Popconfirm
                        title={`Xóa ${selectedRowKeys.length} dòng`}
                        description={`Bạn có chắc là muốn xóa ${selectedRowKeys.length} bài viết đã chọn không`}
                        onConfirm={() => handleDeleteMany(selectedRowKeys.map(key => key.toString()))}
                        cancelText='Hủy'
                        okText='Xóa'
                    >
                        {selectedRowKeys.length > 0 && <Button type="primary" danger>Xóa {selectedRowKeys.length} dòng đã chọn</Button>}
                    </Popconfirm>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={posts}
                loading={loading}
                rowKey={"id"}
                pagination={{
                    current: pagination.page,
                    total: pagination.totalCount,
                    pageSize: pagination.size
                }}
                onChange={(paginate) => {
                    if (paginate.current) {
                        fetchPosts(paginate.current, pagination.size, filter)
                    }
                }}
                rowSelection={rowSelection}
            />
        </div>
    </div>
};

export default GroupPostTabs;
