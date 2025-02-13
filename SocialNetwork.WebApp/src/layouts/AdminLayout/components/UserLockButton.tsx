import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'
import { FC, useState } from 'react'
import { UserResource } from '../../../types/user'
import adminService from '../../../services/adminService'
import { message, Popconfirm } from 'antd'

type UserLockButtonProps = {
    user: UserResource
}
const UserLockButton: FC<UserLockButtonProps> = ({ user }) => {
    const [isLocked, setIsLocked] = useState(user.isLock)

    const handleToggleLock = async () => {
        try {
            const response = await adminService.lockAndUnlockOneAccount(user.id)
            if (response.isSuccess && isLocked === true) {
                message.success('Mở khóa ' + response.message)
                setIsLocked(!isLocked)
            }
            if (response.isSuccess && isLocked === false) {
                message.success('Khóa ' + response.message)
                setIsLocked(!isLocked)
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái khóa:', error)
        }
    }

    return (
        <Popconfirm
            onConfirm={() => handleToggleLock()}
            title={`Xác nhận ${isLocked ? 'mở khóa' : 'khóa'}`}
            description={`Bạn có chắc chắn muốn ${isLocked ? 'mở khóa' : 'khóa'} tài khoản này?`}
            cancelText='Không'
            okText='Chắc chắn'
        >
            <Button
                variant='contained'
                color={isLocked ? 'success' : 'warning'}
                size='small'
                startIcon={<FontAwesomeIcon icon={isLocked ? faUnlock : faLock} style={{ fontSize: 10 }} />}
                style={{ fontSize: 12, padding: '3px 8px', minWidth: 'auto' }}
            >
                {isLocked ? 'Mở khóa' : 'Khóa'}
            </Button>
        </Popconfirm>
    )
}

export default UserLockButton
