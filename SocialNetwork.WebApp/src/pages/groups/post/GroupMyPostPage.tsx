import { FC, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import groupService from "../../../services/groupService";
import { GroupResource } from "../../../types/group";
import { ArchiveX, BookCheck, CircleDashed } from "lucide-react";
import Loading from "../../../components/Loading";
import cn from "../../../utils/cn";
import { Drawer } from "antd";

const GroupMyPostPage: FC = () => {
    const { id } = useParams();
    const location = useLocation()
    const [group, setGroup] = useState<GroupResource>();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const [open, setOpen] = useState(false)

    const fetchGroup = async () => {
        if (id) {
            setLoading(true)
            const response = await groupService.getGroupById(id);
            setLoading(false)
            if (response.isSuccess) {
                setGroup(response.data);
            } else {
                navigate('/404/')
            }
        }
    }

    useEffect(() => {
        fetchGroup()
    }, [id])

    return <div className="w-full h-full grid grid-cols-12 gap-2 md:gap-3 lg:gap-6">
        {loading && <Loading />}
        <div className="w-full h-full col-span-12 flex lg:col-span-3 flex-col gap-y-4 bg-white shadow p-4 border-r-[1px]">
            <div className="w-full">
                <span className="text-lg md:text-xl font-bold">Nội dung của bạn</span>
                <p className="text-gray-500 text-sm">Quản lý và xem bài viết của bạn trong nhóm {group?.name}.</p>
            </div>

            <div className="w-full flex flex-row lg:flex-col gap-2">
                <Link className={cn("flex items-center gap-x-2 p-2 md:p-3 rounded-md hover:bg-gray-100 w-full", location.pathname.includes('/pending') && 'bg-gray-100')} to={`/groups/${id}/my-content/pending`}>
                    <BookCheck size={18} />
                    <span className="text-[15px] font-semibold w-full">Đang chờ</span>
                </Link>
                <Link className={cn("flex items-center gap-x-2 p-2 md:p-3 rounded-md hover:bg-gray-100 w-full", location.pathname.includes('/posted') && 'bg-gray-100')} to={`/groups/${id}/my-content/posted`}>
                    <CircleDashed size={18} />
                    <span className="text-[15px] font-semibold w-full">Đã đăng</span>
                </Link>
                <Link className={cn("flex items-center gap-x-2 p-2 md:p-3 rounded-md hover:bg-gray-100 w-full", location.pathname.includes('/rejected') && 'bg-gray-100')} to={`/groups/${id}/my-content/rejected`}>
                    <ArchiveX size={18} />
                    <span className="text-[15px] font-semibold w-full">Bị từ chối</span>
                </Link>
            </div>
        </div>
        <div className="col-span-12 lg:col-span-9 px-2 md:p-4">
            <Outlet />
        </div>
    </div>
};

export default GroupMyPostPage;
