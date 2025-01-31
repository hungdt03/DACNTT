import { FC, useState } from "react";
import images from "../../assets";
import { Avatar, Button, Divider, Drawer, Modal, Tooltip, message } from "antd";
import { Plus, Settings } from "lucide-react";
import InviteFriendsJoinGroup from "../modals/InviteFriendsJoinGroup";
import useModal from "../../hooks/useModal";
import { GroupResource } from "../../types/group";
import { Link } from "react-router-dom";
import groupService from "../../services/groupService";
import GroupSettingModal from "../modals/GroupSettingModal";

export type InviteFriendsRequest = {
    inviteeIds: string[];
    groupId: string;
}

type GroupHeaderProps = {
    group: GroupResource
}

const GroupHeader: FC<GroupHeaderProps> = ({
    group
}) => {
    const { handleCancel, handleOk, showModal, isModalOpen } = useModal();
    const [openSetting, setOpenSetting] = useState(false)

    const [loading, setLoading] = useState(false)
    const [inviteRequest, setInviteRequest] = useState<InviteFriendsRequest>({
        groupId: group.id,
        inviteeIds: []
    });

    const handleInviteFriends = async () => {
        console.log(inviteRequest)
        setLoading(true)
        const response = await groupService.inviteFriends(inviteRequest);
        setLoading(false)
        if (response.isSuccess) {
            message.success(response.message)
            handleOk()
        } else {
            message.error(response.message)
        }
    }

    return <div className="bg-white w-full shadow">
        <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto overflow-hidden">
            <img className="w-full object-cover max-h-[40vh] rounded-b-xl" src={group.coverImage ?? images.coverGroup} />
            <div className="py-4 flex flex-col gap-y-2">
                <span className="font-bold text-3xl">{group.name}</span>
                <div className="flex items-center gap-x-3">
                    <span className="text-gray-500">Nhóm {group.privacy}</span>
                    <span className="font-semibold text-gray-500">{group.members.length} thành viên</span>
                </div>

                <div className="flex md:flex-row flex-col items-start gap-4 md:gap-0 md:items-center justify-between">
                    <Avatar.Group>
                        {group.members.map(member => <Link key={member.id} to={`/profile/${member.id}`}>
                            <Tooltip title={member.fullName}>
                                <Avatar src={member.avatar} />
                            </Tooltip>
                        </Link>)}
                    </Avatar.Group>

                    <div className="flex items-center gap-x-2">
                        <Button onClick={() => setOpenSetting(true)} icon={<Settings size={16} />} type='primary'>Quản lí nhóm</Button>
                        <Button onClick={showModal} icon={<Plus size={16} />} type='primary'>Mời</Button>
                        <button className="bg-sky-50 text-primary px-3 py-1 rounded-md">Đã tham gia</button>
                    </div>
                </div>

                <Divider className="my-3" />
            </div>
        </div>

        <Modal
            centered
            title={<p className="text-center font-semibold text-xl">Mời bạn bè tham gia nhóm</p>}
            width='800px'
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText='Hủy'
            okText='Gửi lời mời'
            okButtonProps={{
                loading: loading,
                onClick: () => void handleInviteFriends()
            }}
        >
            {isModalOpen && <InviteFriendsJoinGroup
                groupId={group.id}
                onChange={(friendIds) => setInviteRequest({
                    ...inviteRequest,
                    inviteeIds: friendIds
                })}
            />}
        </Modal>

        <Drawer title='Quản lí nhóm' onClose={() => setOpenSetting(false)} open={openSetting}>
            <GroupSettingModal />
        </Drawer>
    </div>
};

export default GroupHeader;
