import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import { Popover } from 'antd'
import { ChevronDown } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectAuth } from '../../../features/slices/auth-slice'
import images from '../../../assets'
import AdminAccountDialog from './AdminAccountDialog'

type HeaderProps = {
    title: string
    isSidebarCollapsed: boolean
}

const AdminHeader: React.FC<HeaderProps> = ({ title, isSidebarCollapsed }) => {
    const { user } = useSelector(selectAuth)
    return (
        <AppBar
            position='fixed'
            color='primary'
            sx={{
                boxShadow: 1,
                height: '80px',
                left: 'auto',
                right: 0,
                width: `calc(100% - ${isSidebarCollapsed ? 80 : 250}px)`,
                transition: 'width 0.3s'
            }}
        >
            <Toolbar sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <Typography
                    variant='h6'
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '30px',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    {title.toUpperCase()}
                </Typography>
                <div style={{ marginLeft: 'auto' }}>
                    <Popover trigger='click' placement='bottomRight' content={<AdminAccountDialog />}>
                        <div className='relative'>
                            <button className='border-[1px] border-gray-300 rounded-full overflow-hidden'>
                                <img className='object-cover w-[38px] h-[38px]' src={user?.avatar ?? images.user} />
                            </button>
                            <button className='absolute right-0 bottom-0 p-[1px] rounded-full border-[1px] bg-gray-50 border-gray-200'>
                                <ChevronDown className='text-gray-500 font-bold' size={14} />
                            </button>
                        </div>
                    </Popover>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default AdminHeader
