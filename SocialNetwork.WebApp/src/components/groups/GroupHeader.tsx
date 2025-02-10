import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Avatar, Button, Divider, Drawer, Form, FormProps, Input, Modal, Radio, Select, Switch, Tooltip, message } from "antd";
import { SettingOutlined } from '@ant-design/icons'
import { Plus } from "lucide-react";
import InviteFriendsJoinGroup from "../modals/InviteFriendsJoinGroup";
import useModal from "../../hooks/useModal";
import { GroupResource } from "../../types/group";
import { Link, useLocation } from "react-router-dom";
import groupService from "../../services/groupService";
import { getGroupPrivacyTitle } from "../../utils/privacy";
import { GroupPrivacy } from "../../enums/group-privacy";
import { JoinGroupRequestResource, JoinGroupResource } from "../../types/join-group";
import cn from "../../utils/cn";
import { GroupRoleInvitationResource } from "../../types/group-role-invitation";
import NotificationLabel from "../NotificationLabel";

export type InviteFriendsRequest = {
    inviteeIds: string[];
    groupId: string;
}

export type EditGroupRequest = {
    name: string;
    description: string;
    isPublic: boolean;
    isHidden: boolean;
    isApprovalPost: boolean;
    isApprovalMember: boolean;
    onlyAdminCanPost: boolean;
    onlyAdminCanApprovalMember: boolean;
}

type GroupHeaderProps = {
    group: GroupResource;
    requestJoin?: JoinGroupRequestResource;
    onFetch: () => void;
    onFetchRequest: () => void
}

const GroupHeader: FC<GroupHeaderProps> = ({
    group,
    requestJoin,
    onFetch,
    onFetchRequest
}) => {
    const location = useLocation()
    const { handleCancel, handleOk, showModal, isModalOpen } = useModal();
    const [openSetting, setOpenSetting] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false)

    const [roleInvitation, setRoleInvitation] = useState<GroupRoleInvitationResource>();

    const [isDisabled, setIsDisabled] = useState(false);
    const [isChange, setIsChange] = useState(false);

    const [form] = Form.useForm<EditGroupRequest>();

    const [loading, setLoading] = useState(false)
    const [inviteRequest, setInviteRequest] = useState<InviteFriendsRequest>({
        groupId: group.id,
        inviteeIds: []
    });

    const handleGetRoleInvitation = async () => {
        const response = await groupService.getRoleInvitation(group.id);
        if(response.isSuccess) {
            setRoleInvitation(response.data)
        } else {
            setRoleInvitation(undefined)
        }
    }

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

    const handleJoinGroup = async (groupId: string) => {
        const response = await groupService.createRequestJoinGroup(groupId);
        if (response.isSuccess) {
            onFetchRequest()
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        if(group.privacy === GroupPrivacy.PUBLIC) setIsDisabled(true);
        handleGetRoleInvitation()
    }, [group])

    const onFinish: FormProps<EditGroupRequest>['onFinish'] = async (values) => {
        setLoadingUpdate(true)
        const response = await groupService.updateGeneralInfo(group.id, values);
        setLoadingUpdate(false)
        if(response.isSuccess) {
            message.success(response.message);
            onFetch();
            setOpenSetting(false)
            form.resetFields()
        } else message.error(response.message)
    };

    const handleAcceptRoleInvitation = async (invitationId: string) => {
        const response = await groupService.acceptRoleInvitation(invitationId);
        if(response.isSuccess) {
            message.success(response.message)
            handleGetRoleInvitation()
        } else {
            message.error(response.message)
        }
    }

    const handleRejectRoleInvitation = async (invitationId: string) => {
        const response = await groupService.rejectRoleInvitation(invitationId);
        if(response.isSuccess) {
            message.success(response.message)
            handleGetRoleInvitation()
        } else {
            message.error(response.message)
        }
    }

    const handleCancelJoinGroupRequest = async (userId: string) => {
        const response = await groupService.cancelRequestJoinGroup(userId);
        if(response.isSuccess) {
            onFetchRequest()
            message.success(response.message)
        } else {
            message.error(response.message);
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
                                {group.isMine && <Button onClick={() => setOpenSetting(true)} icon={<SettingOutlined size={16} />} type="primary">
                                    Cài đặt
                                </Button>}
                                <Button onClick={showModal} icon={<Plus size={16} />} type="primary">
                                    Mời
                                </Button>
                                <button className="bg-sky-50 text-primary px-3 py-1 rounded-md">Đã tham gia</button>
                            </>
                        ) : requestJoin ? (
                            <>
                               <button onClick={() => handleCancelJoinGroupRequest(requestJoin.id)} className="px-3 py-[6px] text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold">Hủy</button>
                                <Button className="cursor-text" type="primary">Chờ phê duyệt</Button>
                            </>
                        ) : (
                            <Button onClick={() => handleJoinGroup(group.id)} icon={<Plus size={16} />} type="primary">
                                Tham gia nhóm
                            </Button>
                        )}
                    </div>
                </div>

                {roleInvitation && <NotificationLabel
                    invitation={roleInvitation}
                    onAccept={() => handleAcceptRoleInvitation(roleInvitation.id)}
                    onReject={() => handleRejectRoleInvitation(roleInvitation.id)}
                />}

                <Divider className="my-3" />

               {group.isMember && <div className="flex gap-x-2 items-center">
                    <Link className={cn("px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-600 text-gray-600 font-semibold")} to={`/groups/${group.id}`}>Thảo luận</Link>
                    <Link className={cn("px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-600 text-gray-600 font-semibold", location.pathname.includes('/members') && 'border-b-[3px] border-primary')} to={`/groups/${group.id}/members`}>Thành viên</Link>
                    <Link className={cn("px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-600 text-gray-600 font-semibold", location.pathname.includes('/images') && 'border-b-[3px] border-primary')} to={`/groups/${group.id}/images`}>Ảnh</Link>
                    <Link className={cn("px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-600 text-gray-600 font-semibold", location.pathname.includes('/videos') && 'border-b-[3px] border-primary')} to={`/groups/${group.id}/videos`}>Video</Link>
                </div>}
            </div>
        </div>

        <Modal
            centered
            title={<p className="text-center font-bold text-lg">Mời bạn bè tham gia nhóm</p>}
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
            <Form
                onFinish={onFinish}
                form={form}
                layout="vertical"
                onValuesChange={() => setIsChange(true)}
                initialValues={{
                    name: group.name,
                    description: group.description,
                    onlyAdminCanPost: group.onlyAdminCanPost,
                    onlyAdminCanApprovalMember: group.onlyAdminCanApprovalMember,
                    isApprovalPost: group.requireApprovalPost,
                    isApprovalMember: group.requireApproval,
                    isHidden: group.isHidden,
                    privacy: group.privacy === GroupPrivacy.PUBLIC
                }}
            >
                <div className="flex flex-col gap-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[16px] font-semibold">Chung</span>
                    </div>
                    <div className="flex flex-col">
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
                            <Input.TextArea rows={3} placeholder="Mô tả..." />
                        </Form.Item>
                    </div>
                </div>
                <Divider className="my-4" />
                <div className="flex flex-col gap-y-4 pb-2">
                    <span className="text-[16px] font-semibold">Quyền riêng tư</span>

                    <div className="pl-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm mb-6">Công khai</span>
                            <Form.Item<EditGroupRequest>
                                valuePropName="checked"
                                name="isPublic"
                            >
                                <Switch
                                    disabled={group.privacy === GroupPrivacy.PRIVATE}
                                    onChange={e => setIsDisabled(e)}
                                 />
                            </Form.Item>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm mb-6">Ẩn nhóm (Chỉ thành viên mới tìm thấy nhóm)</span>
                            <Form.Item<EditGroupRequest>
                                valuePropName="checked"
                                name="isHidden"
                            >
                                <Switch disabled={isDisabled} />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <Divider className="my-4" />
                <div className="flex flex-col gap-y-4 pb-2">
                    <span className="text-[16px] font-semibold">Bài viết</span>
                    <div className="pl-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm mb-6">Phê duyệt bài viết</span>
                            <Form.Item<EditGroupRequest>
                                valuePropName="checked"
                                name="isApprovalPost"
                            >
                                <Switch disabled={isDisabled} />
                            </Form.Item>
                        </div>

                        <Form.Item<EditGroupRequest>
                            name="onlyAdminCanPost"
                            label='Ai có quyền phê duyệt'
                        >
                            <Select
                                disabled={isDisabled}
                                options={[
                                    { value: true, label: 'Quản trị viên và người kiểm duyệt' },
                                    { value: false, label: 'Tất cả thành viên trong nhóm' },
                                ]}
                            />
                        </Form.Item>
                    </div>
                </div>
                <Divider className="my-4" />
                <div className="flex flex-col gap-y-4 pb-2">
                    <span className="text-[16px] font-semibold">Thành viên</span>
                    <div className="pl-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm mb-6">Phê duyệt thành viên</span>
                            <Form.Item<EditGroupRequest>
                                valuePropName="checked"
                                name="isApprovalMember"
                            >
                                <Switch disabled={isDisabled} />
                            </Form.Item>
                        </div>

                        <Form.Item<EditGroupRequest>
                            name="onlyAdminCanApprovalMember"
                            label='Ai có quyền phê duyệt'
                        >
                            <Select
                                disabled={isDisabled}
                                options={[
                                    { value: true, label: 'Quản trị viên và người kiểm duyệt' },
                                    { value: false, label: 'Tất cả thành viên trong nhóm' },
                                ]}
                            />
                        </Form.Item>
                    </div>
                </div>
                <Form.Item label={null} className="flex justify-end mt-8">
                    <Button loading={loadingUpdate} disabled={!isChange} type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>

    </div>
};

export default GroupHeader;
