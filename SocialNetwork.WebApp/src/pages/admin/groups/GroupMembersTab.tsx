import { FC, useEffect, useState } from "react";
import { GroupMemberResource } from "../../../types/group-member";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { Button, Dropdown, Image, Space, Table, TableProps, Tag } from "antd";
import { MemberRole } from "../../../enums/member-role";
import { formatDateStandard } from "../../../utils/date";
import { Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import adminService from "../../../services/adminService";
import { MEMBER_VALUES, RoleFilter } from "../../groups/GroupMemberPage";
import useDebounce from "../../../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

type GroupMembersTabProps = {
    groupId: string;
}

const GroupMembersTab: FC<GroupMembersTabProps> = ({
    groupId
}) => {
    const [members, setMembers] = useState<GroupMemberResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [loading, setLoading] = useState<boolean>(false);

    const [searchValue, setSearchValue] = useState('')
    const [role, setRole] = useState<RoleFilter>('ALL');
    const debouncedValue = useDebounce(searchValue, 300)

    const fetchMembers = async (page: number, size: number) => {
        setLoading(true)
        const response = await adminService.getAllMembersByGroupId(groupId, page, size, searchValue, role);
        setLoading(false)
        if (response.isSuccess) {
            if (page === 1) {
                setMembers(response.data);
            } else {
                setMembers(prevMembers => {
                    const existingIds = new Set(prevMembers.map(m => m.user.id));
                    const newMembers = response.data.filter(m => !existingIds.has(m.user.id));
                    return [...prevMembers, ...newMembers];
                });
            }
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchMembers(1, 6)
    }, [role, debouncedValue, groupId])

    const columns: TableProps<GroupMemberResource>['columns'] = [
        {
            title: 'Tên thành viên',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => record.user.fullName
        },
        {
            title: 'Ảnh',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (_, record) => (
                <Image
                    className="object-cover rounded-lg aspect-square"
                    preview={{
                        mask: null
                    }}
                    src={record.user.avatar}
                    width={50}
                    height={50}
                />
            ),
        },
        {
            title: 'Quyền',
            dataIndex: 'role',
            key: 'role',
            render: (value) => {
                if (value === MemberRole.ADMIN)
                    return <Tag color="green">Quản trị viên</Tag>

                if (value === MemberRole.MODERATOR)
                    return <Tag color="cyan">Người kiểm duyệt</Tag>

                if (value === MemberRole.MEMBER)
                    return <Tag color="geekblue">Thành viên</Tag>
            }
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'joinDate',
            key: 'joinDate',
            render: (value) => {
                return formatDateStandard(new Date(value))
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/admin/users/${record.id}`}>
                        <Button type="primary" size="small" icon={<Eye size={14} />}>Chi tiết</Button>
                    </Link>
                </Space>
            ),
        },
    ];


    return <div>
        <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm mx-auto px-4 w-full py-3 flex flex-col gap-y-3">
            <div className="flex items-center gap-x-2">
                <span className="text-xl font-bold">Tổng số thành viên</span>
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                <span className="text-xl font-bold">{members.length}</span>
            </div>
            <div className="flex items-center gap-x-4">
                <div className="px-4 flex items-center gap-x-2 rounded-3xl bg-gray-100">
                    <Search size={14} />
                    <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm" className="px-2 py-1 w-full bg-gray-100 outline-none border-none" />
                </div>
                <Dropdown
                    menu={{
                        items: MEMBER_VALUES.map(item => ({
                            key: item.key,
                            label: (
                                <button className="py-1 text-left" onClick={() => setRole(item.key as RoleFilter)}>
                                    {item.label}
                                </button>
                            ),
                        })),
                    }}
                    placement="bottom"
                >
                    <button className="flex items-center gap-x-3 py-[6px] px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                        {MEMBER_VALUES.find(item => item.key === role)?.label ?? 'Lọc theo quyền'}
                        <FontAwesomeIcon className="text-gray-500" icon={faCaretDown} />
                    </button>
                </Dropdown>
            </div>
        </div>
        <Table
            columns={columns}
            dataSource={members}
            loading={loading}
            rowKey={"id"}
            pagination={{
                current: pagination.page,
                total: pagination.totalCount,
                pageSize: pagination.size
            }}
            onChange={(paginate) => {
                if (paginate.current) {
                    fetchMembers(paginate.current, pagination.size)
                }
            }}
        />
    </div>
};

export default GroupMembersTab;
