import { FC, useState } from "react";
import images from "../../assets";
import { Avatar, Button, Divider, Drawer, Form, Input, Modal, Radio, Switch, Tooltip, message } from "antd";
import { SettingOutlined } from '@ant-design/icons'
import { Plus } from "lucide-react";
import InviteFriendsJoinGroup from "../modals/InviteFriendsJoinGroup";
import useModal from "../../hooks/useModal";
import { GroupResource } from "../../types/group";
import { Link } from "react-router-dom";
import groupService from "../../services/groupService";
import { getGroupPrivacyTitle } from "../../utils/privacy";
import { GroupPrivacy } from "../../enums/group-privacy";

export type InviteFriendsRequest = {
    inviteeIds: string[];
    groupId: string;
}

export type EditGroupRequest = {
    name: string;
    description: string;
}

type GroupHeaderProps = {
    group: GroupResource
}

const GroupHeader: FC<GroupHeaderProps> = ({
    group
}) => {
    const { handleCancel, handleOk, showModal, isModalOpen } = useModal();
    const [openSetting, setOpenSetting] = useState(false);

    const [isApproval, setIsApproval] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState(false)


    const [loading, setLoading] = useState(false)
    const [inviteRequest, setInviteRequest] = useState<InviteFriendsRequest>({
        groupId: group.id,
        inviteeIds: []
    });

    const handleInviteFriends = async () => {
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

    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };

    const handleJoinGroup = async (groupId: string) => {
        const response = await groupService.createRequestJoinGroup(groupId);
        if (response.isSuccess) {
            setIsApproval(response.data.isApproval)
            setIsSubmit(true)
            message.success(response.message)
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
                    <span className="text-gray-500">Nhóm {getGroupPrivacyTitle(group.privacy)}</span>
                    <span className="font-semibold text-gray-500">{group.members.length} thành viên</span>
                </div>

                <div className="flex md:flex-row flex-col items-start gap-4 md:gap-0 md:items-center justify-between">
                    {(group.privacy === GroupPrivacy.PUBLIC || group.isMember) && (
                        <Avatar.Group>
                            {group.members.map(member => (
                                <Link key={member.id} to={`/profile/${member.id}`}>
                                    <Tooltip title={member.fullName}>
                                        <Avatar src={member.avatar} />
                                    </Tooltip>
                                </Link>
                            ))}
                        </Avatar.Group>
                    )}

                    <div className="flex items-center gap-x-2">
                        {group.isMember ? (
                            <>
                                <Button onClick={() => setOpenSetting(true)} icon={<SettingOutlined size={16} />} type="primary">
                                    Cài đặt
                                </Button>
                                <Button onClick={showModal} icon={<Plus size={16} />} type="primary">
                                    Mời
                                </Button>
                                <button className="bg-sky-50 text-primary px-3 py-1 rounded-md">Đã tham gia</button>
                            </>
                        ) : isSubmit && !isApproval ? (
                            <>
                                <Button danger type="primary" >Hủy</Button>
                                <Button type="primary">Chờ phê duyệt</Button>
                            </>
                        ) : (
                            <Button onClick={() => handleJoinGroup(group.id)} icon={<Plus size={16} />} type="primary">
                                Tham gia nhóm
                            </Button>
                        )}
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

        <Drawer title='Thiết lập nhóm' onClose={() => setOpenSetting(false)} open={openSetting}>
            <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-[16px] font-semibold">Chung</span>
                    </div>
                    <div className="pl-4 flex flex-col gap-y-6">
                        <Form
                            // onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item<EditGroupRequest>
                                label="Tên nhóm"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên nhóm!' }]}
                            >
                                <Input placeholder="Tên nhóm..." />
                            </Form.Item>

                            <Form.Item<EditGroupRequest>
                                label="Mô tả ngắn"
                                name="description"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn!' }]}
                            >
                                <Input.TextArea placeholder="Mô tả..." />
                            </Form.Item>

                            <Form.Item label={null} className="flex justify-end">
                                <Button type="primary" htmlType="submit">
                                    Lưu lại
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className="flex flex-col gap-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-[16px] font-semibold">Quyền riêng tư</span>
                        <div className="flex items-center gap-x-2">
                            <Button size="small">Bỏ</Button>
                            <Button size="small" type="primary">Lưu lại</Button>
                        </div>
                    </div>
                    <div className="pl-4 flex flex-col gap-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Công khai: </span>
                            <Switch defaultChecked onChange={onChange} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Hiển thị: </span>
                            <Switch defaultChecked onChange={onChange} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Phê duyệt bài viết: </span>
                            <Switch defaultChecked onChange={onChange} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Phê duyệt thành viên: </span>
                            <Switch defaultChecked onChange={onChange} />
                        </div>

                    </div>
                </div>
            </div>
        </Drawer>

    </div>
};

export default GroupHeader;
