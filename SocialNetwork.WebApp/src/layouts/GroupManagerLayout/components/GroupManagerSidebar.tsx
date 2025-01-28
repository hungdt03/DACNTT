import { Divider } from "antd";
import { FenceIcon, Search } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GroupRowItem from "../../../components/groups/components/GroupRowItem";
import { GroupResource } from "../../../types/group";
import groupService from "../../../services/groupService";

const GroupManagerSidebar: FC = () => {
    const [joinGroups, setJoinGroups] = useState<GroupResource[]>([]);
    const [manageGroups, setManageGroups] = useState<GroupResource[]>([]);

    const fetchJoinGroups = async () => {
        const response = await groupService.getAllJoinGroup();
        console.log(response)
        if (response.isSuccess) {
            setJoinGroups(response.data)
        }
    }

    const fetchManageGroups = async () => {
        const response = await groupService.getAllManageGroup();
        console.log(response)
        if (response.isSuccess) {
            setManageGroups(response.data)
        }
    }

    useEffect(() => {
        Promise.all([fetchJoinGroups(), fetchManageGroups()])
    }, [])

    return <div className="relative h-full col-span-3 overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 flex flex-col gap-y-2 bg-white z-10 p-4 shadow">
            <span className="font-bold text-xl">Nhóm</span>

            <div className="flex items-center gap-x-2 rounded-3xl bg-gray-100 px-3">
                <Search size={16} />
                <input placeholder="Tìm kiếm nhóm" className="text-sm w-full px-2 py-2 border-none outline-none bg-gray-100" />
            </div>
        </div>
        <div className="px-4 py-2">
            <div className="flex flex-col">
                <Link to='/group-manager/feeds' className="flex items-center gap-x-2 py-3 px-2 rounded-md w-full hover:bg-gray-100">
                    <FenceIcon />
                    <span className="font-semibold">Bảng tin của bạn</span>
                </Link>
                <Link to='/group-manager/feeds' className="flex items-center gap-x-2 py-3 px-2 rounded-md w-full hover:bg-gray-100">
                    <FenceIcon />
                    <span className="font-semibold">Bảng tin của bạn</span>
                </Link>
                <Link to='/group-manager/feeds' className="flex items-center gap-x-2 py-3 px-2 rounded-md w-full hover:bg-gray-100">
                    <FenceIcon />
                    <span className="font-semibold">Bảng tin của bạn</span>
                </Link>

                <Link to='/groups/create' className="mt-2 w-full py-2 rounded-md text-center bg-sky-50 hover:bg-sky-100 text-primary font-semibold">
                    Tạo nhóm mới
                </Link>
            </div>

            <Divider className="my-3" />

            <div className="flex flex-col gap-y-2">
                <span className="text-[16px] font-semibold">Nhóm do bạn quản lí</span>

                <div className="flex flex-col gap-y-1">
                    {manageGroups.map(group => <GroupRowItem key={group.id} group={group} />)}
                </div>
            </div>

            <Divider className="my-3" />

            <div className="flex flex-col gap-y-2">
                <span className="text-[16px] font-semibold">Nhóm bạn đã tham gia</span>

                <div className="flex flex-col gap-y-1">
                    {joinGroups.map(group => <GroupRowItem key={group.id} group={group} />)}
                </div>
            </div>
        </div>
    </div>
};

export default GroupManagerSidebar;
