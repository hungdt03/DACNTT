import { Avatar, Popconfirm } from 'antd'
import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut } from 'lucide-react'
import { AppDispatch } from '../../../app/store'
import { selectAuth, signOut } from '../../../features/slices/auth-slice'

const AdminAccountDialog: FC = () => {
    const { user } = useSelector(selectAuth)
    const dispatch = useDispatch<AppDispatch>()
    const handleLogout = () => dispatch(signOut())

    return (<div className='flex flex-col gap-y-2'>
        <div className='p-3 rounded-md shadow'>
            <div className='flex items-center gap-x-2'>
                <Avatar src={user?.avatar} size={'large'} />
                <span className='font-semibold text-[15px]'>{user?.fullName}</span>
            </div>
        </div>
        <Popconfirm
            onConfirm={handleLogout}
            title='Đăng xuất'
            description='Bạn có chắc là muốn đăng xuất?'
            cancelText='Không'
            okText='Chắc chắn'
        >
            <div className='px-2 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer'>
                <div className='p-1 rounded-full bg-gray-200 border-[1px] border-gray-300'>
                    <LogOut className='font-semibold' size={15} />
                </div>
                <span className='font-semibold text-[15px]'>Đăng xuất</span>
            </div>
        </Popconfirm>
    </div>
    )
}

export default AdminAccountDialog
