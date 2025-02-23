import { Popover } from "antd";
import { ChevronDown } from "lucide-react";
import { FC } from "react";
import AdminAccountDialog from "../components/AdminAccountDialog";
import images from "../../../assets";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";

const AdminHeader: FC = () => {
    const { user } = useSelector(selectAuth)
    return <div className="sticky top-0 flex z-50 items-center justify-end h-[80px] bg-white shadow px-10">
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
};

export default AdminHeader;
