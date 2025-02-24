import { Table, TableProps, Space, DatePicker, Dropdown, Tag, Tooltip, Button, Popconfirm, message } from "antd";
import { FC, useEffect, useState } from "react";
import { PostResource } from "../../../types/post";
import { CONTENT_TYPES, ContentTypeKey, SORT_ORDER, SortOrderKey } from "../../../utils/filter";
import { Eye, Filter, FilterX, Search, Trash } from "lucide-react";
import adminService from "../../../services/adminService";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { Dayjs } from "dayjs";
import { PostType } from "../../../enums/post-type";
import { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const { RangePicker } = DatePicker;

export type PostQueryFilter = {
    search: string;
    fromDate?: string;
    toDate?: string;
    sortOrder: SortOrderKey;
    contentType?: ContentTypeKey;
}

const PostPageManagement: FC = () => {
    const [filter, setFilter] = useState<PostQueryFilter>({
        sortOrder: "desc",
        contentType: 'ALL',
        search: ''
    });
    const [posts, setPosts] = useState<PostResource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues)

    const fetchPosts = async (page: number, size: number, filter: PostQueryFilter) => {
        setLoading(true)
        const response = await adminService.getAllPost(page, size, filter);
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
        } as PostQueryFilter

        setFilter(initFiler)

        fetchPosts(1, 6, initFiler)
    }

    const handleDeleteAll = async () => {
        const response = await adminService.DeleteAllPost();
        if (response.isSuccess) {
            message.success(response.message);
            fetchPosts(1, 6, filter)
        } else {
            message.error(response.message)
        }
    }

    const columns: TableProps<PostResource>['columns'] = [
        {
            title: 'Tác giả',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => <span>{record.user.fullName}</span>,
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
            title: 'Loại bài viết',
            dataIndex: 'postType',
            key: 'postType',
            render: (value) => {
                if (value === PostType.ORIGINAL_POST)
                    return <Tag color="cyan">Bài viết gốc</Tag>
                if (value === PostType.SHARE_POST)
                    return <Tag color="gold">Chia sẻ lại</Tag>
                if (value === PostType.GROUP_POST)
                    return <Tag color="cyan">Bài viết nhóm</Tag>
            }
        },
        {
            title: 'File phương tiện',
            key: 'medias',
            dataIndex: 'medias',
            render: (_, record) => <span>{record.medias.length} file phương tiện</span>,
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
        <div className="z-10 flex items-center justify-between bg-white p-4 rounded-md shadow">

            <div className="flex items-center gap-x-1">
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
            </div>

            <button onClick={handleClearFilter} className="py-1 px-2 hover:bg-gray-200 rounded-md bg-gray-100 flex items-center gap-x-1">
                <FilterX size={18} />
                <span>Bỏ lọc</span>
            </button>
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
                    {posts.length > 1 && <Popconfirm
                        title={`Xóa tất cả bài viết`}
                        description={`Bạn có chắc là muốn xóa tất cả bài viết?`}
                        onConfirm={() => handleDeleteAll()}
                        cancelText='Hủy'
                        okText='Xóa'
                    >
                        <Button type="primary" danger>Xóa tất cả</Button>
                    </Popconfirm>}

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

export default PostPageManagement;
