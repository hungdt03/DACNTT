import { Divider, Empty } from "antd";
import { FenceIcon, Search } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GroupRowItem from "../../../components/groups/components/GroupRowItem";
import { GroupResource } from "../../../types/group";
import groupService from "../../../services/groupService";
import images from "../../../assets";

const GroupManagerSidebar: FC = () => {
    const [joinGroups, setJoinGroups] = useState<GroupResource[]>([]);
    const [manageGroups, setManageGroups] = useState<GroupResource[]>([]);

    const fetchJoinGroups = async () => {
        const response = await groupService.getAllJoinGroup();
        if (response.isSuccess) {
            setJoinGroups(response.data)
        }
    }

    const fetchManageGroups = async () => {
        const response = await groupService.getAllManageGroup();
        if (response.isSuccess) {
            setManageGroups(response.data)
        }
    }

    useEffect(() => {
        Promise.all([fetchJoinGroups(), fetchManageGroups()])
    }, [])

    return <div className="relative h-full col-span-3 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-4">
            <div className="flex flex-col">
                <Link to='/groups/feeds' className="flex items-center gap-x-2 py-3 px-2 rounded-md w-full hover:bg-gray-100">
                    <img alt="Bảng tin" className="w-6 h-6" src={images.feed} />
                    <span className="text-[15px]">Bảng tin của bạn</span>
                </Link>
                <Link to='/groups/create' className="mt-2 w-full py-2 rounded-md text-center bg-sky-50 hover:bg-sky-100 text-primary font-semibold">
                    Tạo nhóm mới
                </Link>
            </div>

            <Divider className="my-3" />

            <div className="flex flex-col gap-y-2">
                <span className="text-[16px] font-semibold">Nhóm do bạn quản lí</span>
                {manageGroups.length === 0 ? <Empty description='Bạn chưa quản lí nhóm nào' /> : <div className="flex flex-col gap-y-1">
                    {manageGroups.map(group => <GroupRowItem key={group.id} group={group} />)}
                </div>}

            </div>

            <Divider className="my-3" />

            <div className="flex flex-col gap-y-2">
                <span className="text-[16px] font-semibold">Nhóm bạn đã tham gia</span>

                {joinGroups.length === 0 ? <Empty description='Bạn chưa tham gia nhóm nào' /> : <div className="flex flex-col gap-y-1">
                    {joinGroups.map(group => <GroupRowItem key={group.id} group={group} />)}
                </div>}
            </div>
        </div>
    </div>
};

export default GroupManagerSidebar;
