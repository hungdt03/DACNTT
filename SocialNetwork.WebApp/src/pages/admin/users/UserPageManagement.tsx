import { Table, TableProps, Space, Button, Popconfirm, message, Image, Avatar } from "antd";
import { FC, useEffect, useState } from "react";
import { PostResource } from "../../../types/post";
import { Eye, Lock, Search, Trash, Unlock } from "lucide-react";
import adminService from "../../../services/adminService";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";
import { UserResource } from "../../../types/user";
import useDebounce from "../../../hooks/useDebounce";
import { formatDateStandard } from "../../../utils/date";


const UserPageManagement: FC = () => {

    const [users, setUsers] = useState<UserResource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 300)

    const [pagination, setPagination] = useState<Pagination>(inititalValues)

    const fetchUsers = async (page: number, size: number, search: string) => {
        setLoading(true)
        const response = await adminService.getAllUser(page, size, search);
        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination)
            if (page === 1) {
                setUsers(response.data)
            } else {
                setUsers(prev => {
                    const newUsers = response.data.filter(newUser =>
                        !prev.some(existedUsers => existedUsers.id === newUser.id)
                    );
                    return [...prev, ...newUsers];
                });
            }
        }
    }

    useEffect(() => {
        fetchUsers(1, pagination.size, debouncedValue)
    }, [debouncedValue]);

    const handleDeleteUser = async (userId: string) => {
        const response = await adminService.DeleteOneAccount(userId);
        if (response.isSuccess) {
            message.success(response.message);
            fetchUsers(pagination.page, pagination.size, debouncedValue)
        } else {
            message.error(response.message)
        }
    }

    const handleDeleteMany = async (userIds: string[]) => {
        const response = await adminService.DeleteManyAccount(userIds);
        if (response.isSuccess) {
            message.success(response.message);
            setSelectedRowKeys([])
            fetchUsers(1, 6, debouncedValue)
        } else {
            message.error(response.message)
        }
    }

    const handleDeleteAll = async () => {
        const response = await adminService.DeleteAllAccount();
        if (response.isSuccess) {
            message.success(response.message);
            fetchUsers(1, 6, debouncedValue)
        } else {
            message.error(response.message)
        }
    }

    const handleLockMany = async (userIds: string[]) => {
        const response = await adminService.lockAndUnlockManyAccount(userIds, '1');
        if (response.isSuccess) {
            message.success(response.message);
            setSelectedRowKeys([])
            fetchUsers(1, 6, debouncedValue)
        } else {
            message.error(response.message)
        }
    }

    const handleUnlockMany = async (userIds: string[]) => {
        const response = await adminService.lockAndUnlockManyAccount(userIds, '2');
        if (response.isSuccess) {
            message.success(response.message);
            setSelectedRowKeys([])
            fetchUsers(pagination.page, pagination.size, debouncedValue)
        } else {
            message.error(response.message)
        }
    }

    const handleToggleLockAccount = async (userId: string)  => {
        const response = await adminService.lockAndUnlockOneAccount(userId);
        if (response.isSuccess) {
            message.success(response.message);
            fetchUsers(pagination.page, pagination.size, debouncedValue)
        } else {
            message.error(response.message)
        }
    }

    const columns: TableProps<UserResource>['columns'] = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (value, record) => {
                return <div className="flex items-center gap-x-2">
                    <Avatar src={record.avatar} />
                    <span>{value}</span>
                </div>
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (value) => formatDateStandard(new Date(value)) === '01/01/1' ? 'Chưa cập nhật' : formatDateStandard(new Date(value))
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'dateJoined',
            key: 'dateJoined',
            render: (value) => formatDateStandard(new Date(value))
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/admin/users/${record.id}`}>
                        <Button type="primary" size="small" icon={<Eye size={14} />}>Chi tiết</Button>
                    </Link>
                    {record.isLock ? <Popconfirm onConfirm={() => handleToggleLockAccount(record.id)}  okText='Chắc chắn' cancelText='Hủy bỏ' title='Mở khỏa' description='Bạn có chắc là muốn mở khóa tài khoản này'>
                        <Button className="!bg-green-500" icon={<Unlock size={14} />} danger type="primary" size="small">Mở khóa</Button>
                    </Popconfirm> : <Popconfirm onConfirm={() => handleToggleLockAccount(record.id)}  okText='Chắc chắn' cancelText='Hủy bỏ' title='Khóa' description='Bạn có chắc là muốn khóa tài khoản này'>
                        <Button className="!bg-orange-400" icon={<Lock size={14} />} danger type="primary" size="small">Khóa</Button>
                    </Popconfirm>}
                    <Popconfirm onConfirm={() => handleDeleteUser(record.id)} okText='Chắc chắn' cancelText='Hủy bỏ' title='Xóa' description='Bạn có chắc là muốn xóa tài khoản này'>
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

    const rowSelection: TableRowSelection<UserResource> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return <div className="flex flex-col gap-4 h-full">
        <div className="z-10 flex items-center justify-between bg-white p-4 rounded-md shadow">
            <div className="flex items-center flex-wrap gap-y-2 gap-x-4 bg-white z-4">
                {/* Input Tìm kiếm */}
                <div className="px-4 flex items-center gap-x-2 rounded-lg bg-gray-100">
                    <Search size={14} />
                    <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}

                        placeholder="Tìm kiếm"
                        className="px-2 py-2 text-sm w-full bg-gray-100 outline-none border-none"
                    />
                </div>
            </div>

        </div>
        <div className="p-4 flex flex-col gap-y-2 shadow rounded-md bg-white">
            <div className="flex items-center justify-between">
                <span className="text-[15px]">{hasSelected ? `Đã chọn ${selectedRowKeys.length} dòng` : null}</span>

                <div className="flex items-center gap-x-2">
                    <Popconfirm
                        title={`Xóa ${selectedRowKeys.length} dòng`}
                        description={`Bạn có chắc là muốn xóa ${selectedRowKeys.length} tài khoản đã chọn không`}
                        onConfirm={() => handleDeleteMany(selectedRowKeys.map(key => key.toString()))}
                        cancelText='Hủy'
                        okText='Xóa'
                    >
                        {selectedRowKeys.length > 0 && <Button icon={<Trash size={14} />} type="primary" danger>Xóa {selectedRowKeys.length} dòng đã chọn</Button>}
                    </Popconfirm>

                    <Popconfirm
                        title={`Khóa ${selectedRowKeys.length} tài khoản`}
                        description={`Bạn có chắc là muốn khóa ${selectedRowKeys.length} tài khoản đã chọn không`}
                        onConfirm={() => handleLockMany(selectedRowKeys.map(key => key.toString()))}
                        cancelText='Hủy'
                        okText='OK'
                    >
                        {selectedRowKeys.length > 0 && <Button className="!bg-orange-400" icon={<Lock size={14} />} type="primary" danger>Khóa {selectedRowKeys.length} dòng đã chọn</Button>}
                    </Popconfirm>
                    <Popconfirm
                        title={`Xóa tất cả tài khoản`}
                        description={`Bạn có chắc là muốn xóa tất cả tài khoản?`}
                        onConfirm={() => handleDeleteAll()}
                        cancelText='Hủy'
                        okText='Xóa'
                    >
                        <Button icon={<Trash size={14} />} type="primary" danger>Xóa tất cả</Button>
                    </Popconfirm>

                    {/* <Popconfirm
                        title={`Khóa tất cả tài khoản`}
                        description={`Bạn có chắc là muốn khóa tất cả tài khoản?`}
                        onConfirm={() => ha()}
                        cancelText='Hủy'
                        okText='Khóa'
                    >
                        <Button className="!bg-orange-400" icon={<Lock size={14} />} type="primary" danger>Khóa tất cả</Button>
                    </Popconfirm> */}

                </div>
            </div>
            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                rowKey={"id"}
                pagination={{
                    current: pagination.page,
                    total: pagination.totalCount,
                    pageSize: pagination.size
                }}
                onChange={(paginate) => {
                    if (paginate.current) {
                        fetchUsers(paginate.current, pagination.size, debouncedValue)
                    }
                }}
                rowSelection={rowSelection}
            />
        </div>
    </div>
};

export default UserPageManagement;
