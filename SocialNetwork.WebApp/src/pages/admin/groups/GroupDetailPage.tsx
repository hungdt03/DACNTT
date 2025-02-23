import { FC, useEffect, useState } from "react";
import { GroupAdminResponse } from "../../../types/group";
import { useParams } from "react-router-dom";
import adminService from "../../../services/adminService";
import { Divider, Tabs } from "antd";
import images from "../../../assets";
import GroupMembersTab from "./GroupMembersTab";
import LoadingIndicator from "../../../components/LoadingIndicator";
import GroupPostTabs from "./GroupPostTabs";
import { formatDateStandard } from "../../../utils/date";
import adminImages from "../../../assets/adminImage";

const GroupDetailPage: FC = () => {
    const [group, setGroup] = useState<GroupAdminResponse>()
    const { groupId } = useParams();

    const fetchGroup = async () => {
        if (groupId) {
            const response = await adminService.getGroupById(groupId);
            if (response.isSuccess) {
                setGroup(response.data)
            }
        }
    }

    useEffect(() => {
        fetchGroup()
    }, [groupId])
    return <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
            <div className="grid grid-cols-4 gap-4">
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={adminImages.dateCreated} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{formatDateStandard(new Date(group?.dateCreated!))}</span>
                        <span>Ngày lập</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={50} src={adminImages.members} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{group?.countMembers}</span>
                        <span>Thành viên</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={adminImages.post} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{group?.countPosts}</span>
                        <span>Tất cả bài viết</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={adminImages.onlyToday} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{group?.countTodayPosts}</span>
                        <span>Bài viết hôm nay</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-y-4 col-span-4 shadow bg-white rounded-md p-4">
            <img
                style={{
                    aspectRatio: 3 / 1
                }}
                className="object-cover rounded-md"
                src={group?.coverImage}
            />

            <div className="flex flex-col items-center gap-y-2">
                <span className="text-xl font-bold">{group?.name}</span>
                <p className="text-sm text-gray-600 line-clamp-3">{group?.description}</p>
            </div>
            <Divider className="my-0" />
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Ngày lập</span>
                    <span className="text-sm text-gray-600">{formatDateStandard(new Date(group?.dateCreated!))}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Loại nhóm</span>
                    <span className="text-sm text-gray-600">Công khai</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Phê duyệt bài viết</span>
                    <span className="text-sm text-gray-600">{group?.requireApprovalPost ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Phê duyệt thành viên</span>
                    <span className="text-sm text-gray-600">{group?.requireApproval ? '✅' : '❌'}</span>
                </div>
            </div>
        </div>

        <div className="col-span-8 bg-white p-4 rounded-md shadow">
            <Tabs
                items={[
                    {
                        key: 'members',
                        label: 'Thành viên',
                        children: groupId ? <GroupMembersTab groupId={groupId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    },
                    {
                        key: 'posts',
                        label: 'Bài viết',
                        children: groupId ? <GroupPostTabs groupId={groupId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    }
                ]}
            />
        </div>

    </div>
};

export default GroupDetailPage;
