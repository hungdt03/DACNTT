import { FC, useEffect, useState } from "react";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { Button, Image, Space, Table, TableProps } from "antd";
import { Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import adminService from "../../../services/adminService";
import useDebounce from "../../../hooks/useDebounce";
import { FriendResource } from "../../../types/friend";

type UserFriendTabsProps = {
    userId: string;
}

const UserFriendTabs: FC<UserFriendTabsProps> = ({
    userId
}) => {
    const [friends, setFriends] = useState<FriendResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues)
    const [loading, setLoading] = useState<boolean>(false);

    const [searchValue, setSearchValue] = useState('')
    const debouncedValue = useDebounce(searchValue, 300)

    const fetchFriends = async (page: number, size: number) => {
        setLoading(true)
        const response = await adminService.getAllFriendsByUserId(userId, page, size, debouncedValue);
        console.log(response)
        setLoading(false)
        if (response.isSuccess) {
            if (page === 1) {
                setFriends(response.data);
            } else {
                setFriends(prevFriends => {
                    const existingIds = new Set(prevFriends.map(m => m.id));
                    const newMembers = response.data.filter(m => !existingIds.has(m.id));
                    return [...prevFriends, ...newMembers];
                });
            }
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchFriends(1, 6)
    }, [debouncedValue, userId])

    const columns: TableProps<FriendResource>['columns'] = [
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => record.fullName
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
                    src={record.avatar}
                    width={50}
                    height={50}
                />
            ),
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
                <span className="text-xl font-bold">Tổng số bạn bè</span>
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                <span className="text-xl font-bold">{friends.length}</span>
            </div>
            <div className="flex items-center gap-x-4">
                <div className="px-4 flex items-center gap-x-2 rounded-3xl bg-gray-100">
                    <Search size={14} />
                    <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm" className="px-2 py-1 w-full bg-gray-100 outline-none border-none" />
                </div>
            </div>
        </div>
        <Table
            columns={columns}
            dataSource={friends}
            loading={loading}
            rowKey={"id"}
            pagination={{
                current: pagination.page,
                total: pagination.totalCount,
                pageSize: pagination.size
            }}
            onChange={(paginate) => {
                if (paginate.current) {
                    fetchFriends(paginate.current, pagination.size)
                }
            }}
        />
    </div>
};

export default UserFriendTabs;
