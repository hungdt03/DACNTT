import { FC } from "react";
import { GroupResource } from "../../../types/group";
import images from "../../../assets";
import { Book, ChartBarIcon, GitPullRequest, Home, Lock, UserCog } from "lucide-react";
import { Divider } from "antd";
import { Link, useLocation } from "react-router-dom";
import cn from "../../../utils/cn";
import { getGroupPrivacyTitle } from "../../../utils/privacy";

type MyGroupManageSidebarProps = {
    group: GroupResource;

}

const MyGroupManageSidebar: FC<MyGroupManageSidebarProps> = ({
    group,
}) => {
    const location = useLocation();

    return <>
        <div className="flex items-center gap-x-2 px-2 py-4">
            <img alt="Ảnh bìa nhóm" className="w-[50px] h-[50px] rounded-md object-cover border-[1px] border-gray-100" src={group.coverImage ?? images.cover} />
            <div className="flex flex-col">
                <span className="font-bold">{group.name}</span>
                <div className="flex gap-x-2 items-center text-sm">
                    <div className="flex items-center gap-x-1 text-gray-400">
                        <Lock className="mb-1" size={14} />
                        <span>Nhóm {getGroupPrivacyTitle(group.privacy)}</span>
                    </div>
                    <span className="font-bold text-gray-500">{group.members.length} thành viên</span>
                </div>
            </div>
        </div>
        <Divider className="my-0" />

        <div className="flex flex-col gap-y-1 px-2 py-4">
            <Link to={`/groups/${group.id}`} className={cn("flex items-center hover:text-black text-[15px] gap-x-2 py-3 px-2 rounded-md hover:bg-gray-100 cursor-pointer", !location.pathname.split('/')[3] && 'bg-gray-100')}>
                <Home size={20} />
                <span className="font-semibold">Trang chủ của cộng đồng</span>
            </Link>

            <Link to={`/groups/${group.id}/pending-posts`} className={cn("flex items-center hover:text-black text-[15px] gap-x-2 py-3 px-2 rounded-md hover:bg-gray-100 cursor-pointer", location.pathname.includes('pending-posts') && 'bg-gray-100')}>
                <Book size={20} />
                <span className="font-semibold">Bài viết đang chờ</span>
            </Link>

            <Link to={`/groups/${group.id}/pending-members`} className={cn("flex items-center hover:text-black text-[15px] gap-x-2 py-3 px-2 rounded-md hover:bg-gray-100 cursor-pointer", location.pathname.includes('pending-members') && 'bg-gray-100')}>
                <UserCog size={20} />
                <span className="font-semibold">Yêu cầu thành viên</span>
            </Link>
            {group.onlyAdminCanApprovalMember && <Link to={`/groups/${group.id}/pending-invites`} className={cn("flex items-center hover:text-black text-[15px] gap-x-2 py-3 px-2 rounded-md hover:bg-gray-100 cursor-pointer", location.pathname.includes('pending-invites') && 'bg-gray-100')}>
                <GitPullRequest size={20} />
                <span className="font-semibold">Lời mời từ thành viên</span>
            </Link>}
            {group.isMine && <Link to={`/groups/${group.id}/pending-reports`} className={cn("flex items-center hover:text-black text-[15px] gap-x-2 py-3 px-2 rounded-md hover:bg-gray-100 cursor-pointer", location.pathname.includes('pending-reports') && 'bg-gray-100')}>
                <ChartBarIcon size={20} />
                <span className="font-semibold">Báo cáo đang chờ</span>
            </Link>}
        </div >
    </>
};

export default MyGroupManageSidebar;
