import { FC, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import groupService from "../../../services/groupService";
import { GroupResource } from "../../../types/group";
import { ArchiveX, BookCheck, CircleDashed } from "lucide-react";
import Loading from "../../../components/Loading";
import cn from "../../../utils/cn";

const GroupMyPostPage: FC = () => {
    const { id } = useParams();
    const location = useLocation()
    const [group, setGroup] = useState<GroupResource>();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

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

    useEffect(() => {

    }, [location])

    return <div className="w-full h-full grid grid-cols-12 gap-6">
        {loading && <Loading />}
        <div className="w-full h-full col-span-3 flex flex-col gap-y-4 bg-white shadow p-4 border-r-[1px]">
            <div className="w-full">
                <span className="text-xl font-bold">Nội dung của bạn</span>
                <p className="text-gray-500 text-sm">Quản lý và xem bài viết của bạn trong nhóm {group?.name}.</p>
            </div>

            <div className="w-full flex flex-col">
                <Link className={cn("flex items-center gap-x-2 p-3 rounded-md hover:bg-gray-100 w-full", location.pathname.includes('/pending') && 'bg-gray-100')} to={`/groups/${id}/my-content/pending`}>
                    <BookCheck size={18} />
                    <span className="text-[15px] font-semibold w-full">Đang chờ</span>
                </Link>
                <Link className={cn("flex items-center gap-x-2 p-3 rounded-md hover:bg-gray-100 w-full", location.pathname.includes('/posted') && 'bg-gray-100')} to={`/groups/${id}/my-content/posted`}>
                    <CircleDashed size={18} />
                    <span className="text-[15px] font-semibold w-full">Đã đăng</span>
                </Link>
                <Link className={cn("flex items-center gap-x-2 p-3 rounded-md hover:bg-gray-100 w-full", location.pathname.includes('/rejected') && 'bg-gray-100')} to={`/groups/${id}/my-content/rejected`}>
                    <ArchiveX size={18} />
                    <span className="text-[15px] font-semibold w-full">Bị từ chối</span>
                </Link>
            </div>
        </div>
        <div className="col-span-9 p-4">
            <Outlet />
        </div>
    </div>
};

export default GroupMyPostPage;
