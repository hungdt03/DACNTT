import { Table, TableProps, Space, Button, Popconfirm, message, Avatar } from "antd";
import { FC, useEffect, useState } from "react";
import { Eye, Lock, Search, Trash, Unlock } from "lucide-react";
import adminService from "../../services/adminService";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { UserResource } from "../../types/user";
import useDebounce from "../../hooks/useDebounce";
import AddAccountDialog from "../../components/dialogs/AddAccountDialog";
import { PlusOutlined } from '@ant-design/icons'
import { Role } from "../../enums/role";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";


const AdminAccountPage: FC = () => {
    const { user } = useSelector(selectAuth)
    const [users, setUsers] = useState<UserResource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 300);
    const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false)

    const [pagination, setPagination] = useState<Pagination>(inititalValues);

    const handleCloseSignUpDialog = () => setIsSignUpDialogOpen(false)
    const handleOpenSignUpDialog = () => setIsSignUpDialogOpen(true)


    const fetchUsers = async (page: number, size: number, search: string) => {
        setLoading(true)
        const response = await adminService.getAllAdmins(page, size, search);
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

    const handleToggleLockAccount = async (userId: string) => {
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
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                user?.id !== record.id && <Space size="middle">
                    {record.isLock ? <Popconfirm onConfirm={() => handleToggleLockAccount(record.id)} okText='Chắc chắn' cancelText='Hủy bỏ' title='Mở khỏa' description='Bạn có chắc là muốn mở khóa tài khoản này'>
                        <Button className="!bg-green-500" icon={<Unlock size={14} />} danger type="primary" size="small">Mở khóa</Button>
                    </Popconfirm> : <Popconfirm onConfirm={() => handleToggleLockAccount(record.id)} okText='Chắc chắn' cancelText='Hủy bỏ' title='Khóa' description='Bạn có chắc là muốn khóa tài khoản này'>
                        <Button className="!bg-orange-400" icon={<Lock size={14} />} danger type="primary" size="small">Khóa</Button>
                    </Popconfirm>}
                    <Popconfirm onConfirm={() => handleDeleteUser(record.id)} okText='Chắc chắn' cancelText='Hủy bỏ' title='Xóa' description='Bạn có chắc là muốn xóa tài khoản này'>
                        <Button icon={<Trash size={14} />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

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

            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenSignUpDialog()}>
                    Thêm tài khoản
            </Button>
        </div>
        <div className="p-4 flex flex-col gap-y-2 shadow rounded-md bg-white">
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
            />

            <AddAccountDialog
                isVisible={isSignUpDialogOpen}
                onClose={handleCloseSignUpDialog}
                title='THÊM TÀI KHOẢN QUẢN TRỊ VIÊN'
                role={Role.ADMIN}
                fetchUsers={() => fetchUsers(pagination.page, pagination.size, debouncedValue)}
            />
        </div>
    </div>
};

export default AdminAccountPage;
