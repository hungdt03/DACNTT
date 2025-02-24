import { Table, TableProps, Space, Dropdown, Tag, Tooltip, Button, Popconfirm, message, Image, Avatar } from "antd";
import { FC, useEffect, useState } from "react";
import { Eye, Filter, FilterX, Search, Trash } from "lucide-react";
import adminService from "../../../services/adminService";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";
import { GroupResource } from "../../../types/group";
import { GroupPrivacy } from "../../../enums/group-privacy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { UserResource } from "../../../types/user";
import { formatDateStandard } from "../../../utils/date";

type GroupPrivacyKey = 'PUBLIC' | 'PRIVATE' | 'ALL'

interface GroupPrivacyItem {
    key: GroupPrivacyKey;
    label: string
}

const GROUP_PRIVACY_TYPES: GroupPrivacyItem[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PUBLIC', label: 'Công khai' },
    { key: 'PRIVATE', label: 'Riêng tư' },
]


const GroupPageManagement: FC = () => {
    const [searchValue, setSearchValue] = useState('')
    const [privacy, setPrivacy] = useState<GroupPrivacyKey>('ALL')
    const [groups, setGroups] = useState<GroupResource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [pagination, setPagination] = useState<Pagination>(inititalValues)

    const fetchGroups = async (page: number, size: number, searchValue: string, privacy: string) => {
        setLoading(true)
        const response = await adminService.getAllGroup(page, size, searchValue, privacy);
        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination)
            if (page === 1) {
                setGroups(response.data)
            } else {
                setGroups(prev => {
                    const newGroups = response.data.filter(newGroup =>
                        !prev.some(existingGroups => existingGroups.id === newGroup.id)
                    );
                    return [...prev, ...newGroups];
                });
            }
        }
    }

    useEffect(() => {
        fetchGroups(1, pagination.size, searchValue, privacy)
    }, []);

    const handleDeleteGroup = async (groupId: string) => {
        const response = await adminService.DeleteOneGroup(groupId);
        if (response.isSuccess) {
            message.success(response.message);
            fetchGroups(pagination.page, pagination.size, searchValue, privacy)
        } else {
            message.error(response.message)
        }
    }

    const handleDeleteMany = async (groupIds: string[]) => {
        const response = await adminService.DeleteManyGroup(groupIds);
        if (response.isSuccess) {
            message.success(response.message);
            setSelectedRowKeys([])
            fetchGroups(1, 6, searchValue, privacy)
        } else {
            message.error(response.message)
        }
    }


    const handleContentTypeChange = (key: GroupPrivacyKey) => {
        setPrivacy(key)
        fetchGroups(1, pagination.size, searchValue, key)
    };


    const handleClearFilter = () => {
        setSearchValue('')
        setPrivacy('ALL')

        fetchGroups(1, 6, '', 'ALL')
    }

    const handleDeleteAll = async () => {
        const response = await adminService.DeleteAllGroup();
        if (response.isSuccess) {
            message.success(response.message);
            fetchGroups(1, 6, '', 'ALL')
        } else {
            message.error(response.message)
        }
    }

    const columns: TableProps<GroupResource>['columns'] = [
        {
            title: 'Tên nhóm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ảnh',
            dataIndex: 'coverImage',
            key: 'coverImage',
            render: (value) => (
                <Image
                    className="object-cover rounded-lg"
                    preview={{
                        mask: null
                    }}
                    src={value}
                    width={80}
                    style={{
                        aspectRatio: 3 / 2
                    }}
                />
            ),
        },
        {
            title: 'Mô tả ngắn',
            dataIndex: 'description',
            key: 'description',
            width: 200,
            render: (value) => (
                <Tooltip title={value}>
                    <p className="w-[200px] truncate whitespace-nowrap overflow-hidden">{value}</p>
                </Tooltip>
            )
        },
        {
            title: 'Loại nhóm',
            dataIndex: 'privacy',
            key: 'privacy',
            render: (value) => {
                if (value === GroupPrivacy.PUBLIC)
                    return <Tag color="cyan">Nhóm công khai</Tag>
                if (value === GroupPrivacy.PRIVATE)
                    return <Tag color="gold">Nhóm riêng tư</Tag>
            }
        },
        {
            title: 'Thành viên',
            dataIndex: 'members',
            key: 'members',
            render: (value: UserResource[]) => {
                return <Avatar.Group>
                    {value.slice(0, 3).map(item => (
                        <Tooltip key={item.id} title={item.fullName}>
                            <Avatar size="small" src={item.avatar} />
                        </Tooltip>
                    ))}
                    {value.length > 3 && <span>và {value.length - 3} người khác</span>}
                </Avatar.Group>
            }
        },
        {
            title: 'Ngày lập',
            dataIndex: 'dateCreated',
            render: (value) => formatDateStandard(new Date(value))
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/admin/groups/${record.id}`}>
                        <Button type="primary" size="small" icon={<Eye size={14} />}>Chi tiết</Button>
                    </Link>
                    <Popconfirm onConfirm={() => handleDeleteGroup(record.id)} okText='Chắc chắn' cancelText='Hủy bỏ' title='Giải tán nhóm' description='Bạn có chắc là muốn giải tán nhóm này'>
                        <Button icon={<Trash size={14} />} danger type="primary" size="small">Giải tán</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<GroupResource> = {
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
                <div className="px-4 flex items-center gap-x-2 rounded-lg bg-gray-100">
                    <Search size={14} />
                    <input
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value)
                            fetchGroups(1, pagination.size, e.target.value, privacy)
                        }}

                        placeholder="Tìm kiếm"
                        className="px-2 py-2 text-sm w-full bg-gray-100 outline-none border-none"
                    />
                </div>

                <Dropdown
                    menu={{
                        items: GROUP_PRIVACY_TYPES.map((item) => ({
                            key: item.key,
                            label: item.label,
                            onClick: () => handleContentTypeChange(item.key),
                        })),
                    }}
                    placement="bottom"
                >
                    <button className="py-[6px] flex items-center gap-x-3 px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                        {privacy === 'ALL' ? 'Tất cả' : privacy === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                        <FontAwesomeIcon className="text-gray-500" icon={faCaretDown} />
                    </button>
                </Dropdown>

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
                        description={`Bạn có chắc là muốn xóa ${selectedRowKeys.length} nhóm đã chọn không`}
                        onConfirm={() => handleDeleteMany(selectedRowKeys.map(key => key.toString()))}
                        cancelText='Hủy'
                        okText='Xóa'
                    >
                        {selectedRowKeys.length > 0 && <Button type="primary" danger>Xóa {selectedRowKeys.length} dòng đã chọn</Button>}
                    </Popconfirm>
                    {groups.length > 1 && <Popconfirm
                        title={`Xóa tất cả nhóm`}
                        description={`Bạn có chắc là muốn xóa tất cả nhóm?`}
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
                dataSource={groups}
                loading={loading}
                rowKey={"id"}
                pagination={{
                    current: pagination.page,
                    total: pagination.totalCount,
                    pageSize: pagination.size
                }}
                onChange={(paginate) => {
                    if (paginate.current) {
                        fetchGroups(paginate.current, pagination.size, searchValue, privacy)
                    }
                }}
                rowSelection={rowSelection}
            />
        </div>
    </div>
};

export default GroupPageManagement;
