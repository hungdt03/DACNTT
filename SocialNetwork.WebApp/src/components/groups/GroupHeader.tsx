import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Avatar, Button, Divider, Drawer, Form, FormProps, Input, Modal, Popconfirm, Popover, Select, Switch, Tooltip, Upload, UploadFile, message } from "antd";
import { SettingOutlined } from '@ant-design/icons'
import { ChartNoAxesGantt, CheckIcon, LucideUpload, MoreHorizontal, Plus } from "lucide-react";
import InviteFriendsJoinGroup from "../modals/InviteFriendsJoinGroup";
import useModal from "../../hooks/useModal";
import { GroupResource } from "../../types/group";
import { Link, useLocation, useNavigate } from "react-router-dom";
import groupService from "../../services/groupService";
import { getGroupPrivacyTitle } from "../../utils/privacy";
import { GroupPrivacy } from "../../enums/group-privacy";
import { JoinGroupRequestResource } from "../../types/join-group";
import cn from "../../utils/cn";
import { GroupRoleInvitationResource } from "../../types/group-role-invitation";
import GroupRoleInvitationLabel from "../labels/GroupRoleInvitationLabel";
import { GroupInvitationResource } from "../../types/group-invitation";
import GroupInvitationLabel from "../labels/GroupInvitationLabel";
import { GroupMemberResource } from "../../types/group-member";
import ChooseNewAdminModal from "../modals/ChooseNewAdminModal";
import MyGroupManageSidebar from "./components/MyGroupManageSidebar";
import { RcFile, UploadProps } from "antd/es/upload";
import { getBase64, isValidImage } from "../../utils/file";
import ReportPostModal from "../modals/reports/ReportPostModal";
import reportService from "../../services/reportService";

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
    inviteJoin?: GroupInvitationResource;
    onFetchInvite: () => void;
    onFetchRequest: () => void;
    onFetchGroup: () => void;
}

const GroupHeader: FC<GroupHeaderProps> = ({
    group,
    requestJoin,
    inviteJoin,
    onFetchInvite,
    onFetchRequest,
    onFetchGroup
}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { handleCancel, handleOk, showModal, isModalOpen } = useModal();
    const { handleCancel: cancelLeave, handleOk: okLeave, showModal: showLeave, isModalOpen: openLeave } = useModal();
    const { handleCancel: cancelReport, handleOk: okReport, showModal: showReport, isModalOpen: openReport } = useModal();

    const [openSetting, setOpenSetting] = useState(false);
    const [openManage, setOpenManage] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const [roleInvitation, setRoleInvitation] = useState<GroupRoleInvitationResource>();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isDisabledSectionFriends, setIsDisabledSectionFriends] = useState(false);
    const [isDisabledApprovalPost, setIsDisabledApprovalPost] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [groupMembers, setGroupMembers] = useState<GroupMemberResource[]>([])

    const [reason, setReason] = useState('')

    const [form] = Form.useForm<EditGroupRequest>();

    const [loading, setLoading] = useState(false)
    const [inviteRequest, setInviteRequest] = useState<InviteFriendsRequest>({
        groupId: group.id,
        inviteeIds: []
    });

    const [coverLoading, setCoverLoading] = useState(false)
    const [tempCoverImage, setTempCoverImage] = useState<string>('')
    const [fileCoverImage, setFileCoverImage] = useState<UploadFile>();

    const [selectMember, setSelectMember] = useState<GroupMemberResource>()

    const handleGetRoleInvitation = async () => {
        const response = await groupService.getRoleInvitation(group.id);
        if (response.isSuccess) {
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
            onFetchRequest();
            onFetchGroup();
            message.success(response.message)
        } else {
            message.error(response.message);
            onFetchGroup();
        }
    }

    const fetchGroupMembers = async () => {
        const response = await groupService.getAllMembersByGroupId(group.id, 1, 9);
        if(response.isSuccess) {
            setGroupMembers(response.data)
        }
    }

    useEffect(() => {
        if (group.privacy === GroupPrivacy.PUBLIC) setIsDisabled(true);
        if (group.isHidden) setIsDisabledSectionFriends(true);
        if (group.onlyAdminCanPost) setIsDisabledApprovalPost(true);
        handleGetRoleInvitation();
        fetchGroupMembers()
    }, [group])

    const onFinish: FormProps<EditGroupRequest>['onFinish'] = async (values) => {
        setLoadingUpdate(true)
        const response = await groupService.updateGeneralInfo(group.id, values);
        setLoadingUpdate(false)
        if (response.isSuccess) {
            message.success(response.message);
            onFetchGroup();
            setOpenSetting(false)
            form.resetFields()
        } else message.error(response.message)
    };

    const handleAcceptInviteJoinGroup = async (inviteId: string) => {
        const response = await groupService.acceptInviteFriend(inviteId);
        if (response.isSuccess) {
            onFetchGroup();
            onFetchRequest();
            onFetchInvite();
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const handleRejectInviteJoinGroup = async (inviteId: string) => {
        const response = await groupService.rejectInviteFriend(inviteId);
        if (response.isSuccess) {
            onFetchGroup();
            onFetchRequest();
            onFetchInvite();
            message.success(response.message)
        } else {
            onFetchGroup();
            message.error(response.message)
        }
    }


    const handleAcceptRoleInvitation = async (invitationId: string) => {
        const response = await groupService.acceptRoleInvitation(invitationId);
        if (response.isSuccess) {
            message.success(response.message)
            handleGetRoleInvitation()
        } else {
            message.error(response.message)
        }
    }

    const handleRejectRoleInvitation = async (invitationId: string) => {
        const response = await groupService.rejectRoleInvitation(invitationId);
        if (response.isSuccess) {
            message.success(response.message)
            handleGetRoleInvitation()
        } else {
            message.error(response.message)
        }
    }


    const handleCancelJoinGroupRequest = async (userId: string) => {
        const response = await groupService.cancelRequestJoinGroup(userId);
        if (response.isSuccess) {
            onFetchRequest()
            message.success(response.message)
        } else {
            message.error(response.message);
        }
    }

    const handleLeaveGroup = async (groupId: string, memberId?: string) => {
        const response = await groupService.leaveGroup(groupId, memberId);
        if (response.isSuccess) {
            message.success(response.message);
            navigate('/groups')
        } else {
            message.error(response.message)
        }
    }

    const uploadCoverImage = async (file: UploadFile | undefined) => {

        if (file) {
            const formData = new FormData();
            formData.append('image', file as RcFile);
            formData.append('groupId', group.id);

            setCoverLoading(true)
            const response = await groupService.uploadCoverImage(formData);
            setCoverLoading(false)

            if (response.isSuccess) {
                onFetchGroup()
                message.success(response.message);
                setFileCoverImage(undefined)
                setTempCoverImage('')
            } else {
                message.error(response.message)
            }
        }

    }

    const onCoverImageChange: UploadProps['onChange'] = async ({ file }) => {

        if (!isValidImage(file as RcFile)) {
            message.error('Vui lòng chọn file ảnh')
            return;
        } else {
            const totalSize = (file as RcFile).size;
            const maxSize = 4 * 1024 * 1024;

            if (totalSize > maxSize) {
                message.error("Vui lòng chọn file ảnh tối đa 4MB");
                return;
            }
        }

        const base64Url = await getBase64(file as RcFile);
        setTempCoverImage(base64Url);
        setFileCoverImage(file)
    };

    const handleRemoveGroup = async () => {
        const response = await groupService.deleteGroup(group.id);
        if (response.isSuccess) {
            message.success(response.message);
            navigate('/groups')
        } else {
            message.error(response.message)
        }
    }

    const handleReportGroup = async () => {
        const response = await reportService.reportGroup(group.id, reason);
        if(response.isSuccess) {
            message.success(response.message);
            okReport();
            setReason('')
        } else {
            message.error(response.message)
        }
    }

    return <div className="bg-white w-full shadow lg:px-4 sm:px-2 px-2">
        <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm lg:px-0 mx-auto overflow-hidden">
            <div className="relative">
                <img className="w-full object-cover max-h-[40vh] rounded-b-xl" src={tempCoverImage || group.coverImage || images.cover} />
                {group.isMine && <div className="flex items-center gap-x-2 absolute right-4 top-4 md:top-auto md:bottom-4 shadow">
                    <Upload
                        beforeUpload={() => false}
                        showUploadList={false}
                        onChange={onCoverImageChange}
                        multiple={false}
                        className="cursor-pointer w-full"
                        disabled={loading}
                    >
                        <button disabled={coverLoading} className="shadow bg-white text-primary flex items-center gap-x-2 px-3 py-2 rounded-md cursor-pointer">
                            <LucideUpload size={18} />
                            <span className="text-sm font-semibold">
                                {tempCoverImage ? 'Chọn ảnh khác' : 'Thêm ảnh bìa'}
                            </span>
                        </button>
                    </Upload>
                    {tempCoverImage && <Button loading={coverLoading} onClick={() => uploadCoverImage(fileCoverImage)} type="primary" className="cursor-pointer" icon={<CheckIcon />}>
                        Lưu lại
                    </Button>}
                </div>}
            </div>
            <div className="py-4 flex flex-col gap-y-2">
                <span className="font-bold text-3xl">{group.name}</span>
                <div className="flex items-center gap-x-3">
                    <span className="text-gray-500 text-sm md:text-[16px]">Nhóm {getGroupPrivacyTitle(group.privacy)}</span>
                    <span className="font-semibold text-sm md:text-[16px] text-gray-500">{group.members.length} thành viên</span>
                </div>

                <div className="flex md:flex-row flex-col items-start gap-4 md:gap-0 md:items-center justify-between">
                    {(group.privacy === GroupPrivacy.PUBLIC || group.isMember) && (
                        <Avatar.Group>
                            {groupMembers.map(member => (
                                <Link key={member.id} to={`/profile/${member.id}`}>
                                    <Tooltip title={member.user.fullName}>
                                        <Avatar src={member.user.avatar} />
                                    </Tooltip>
                                </Link>
                            ))}
                        </Avatar.Group>
                    )}

                    <div className="flex items-center flex-wrap gap-2">
                        {group.isMember ? (
                            <>
                                {group.isMine && (
                                    <>
                                        <Button className="lg:hidden" onClick={() => setOpenManage(true)} icon={<ChartNoAxesGantt size={16} />} type="primary">
                                            Quản lí
                                        </Button>
                                        <Button onClick={() => setOpenSetting(true)} icon={<SettingOutlined size={16} />} type="primary">
                                            Cài đặt
                                        </Button>
                                    </>
                                )}

                                <Button onClick={showModal} icon={<Plus size={16} />} type="primary">
                                    Mời
                                </Button>

                                {group.isMine && group.adminCount === 1 && group.countMembers > 1 ? (
                                    <button onClick={showLeave} className="font-semibold px-3 py-[6px] text-sm hover:bg-gray-200 rounded-md bg-gray-100">
                                        Rời nhóm
                                    </button>
                                ) : (
                                    <Popconfirm
                                        onConfirm={() => handleLeaveGroup(group.id)}
                                        title="Rời nhóm"
                                        cancelText="Hủy bỏ"
                                        okText="Rời nhóm"
                                        description={group.countMembers === 1 ?
                                            "Bạn là thành viên cuối cùng của nhóm, nhóm sẽ bị xóa khi bạn rời đi!" :
                                            "Bạn có chắc muốn rời nhóm không?"
                                        }
                                    >
                                        <button className="font-semibold px-3 py-[6px] text-sm hover:bg-gray-200 rounded-md bg-gray-100">
                                            Rời nhóm
                                        </button>
                                    </Popconfirm>
                                )}

                                <button className="font-semibold bg-sky-50 text-sm text-primary px-3 py-[6px] rounded-md">
                                    Đã tham gia
                                </button>
                            </>
                        ) : (
                            inviteJoin?.status || requestJoin ? (
                                <>
                                    {requestJoin && (
                                        <button
                                            onClick={() => handleCancelJoinGroupRequest(requestJoin.id)}
                                            className="px-3 py-[6px] text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold"
                                        >
                                            Hủy
                                        </button>
                                    )}
                                    <Button className="cursor-text" type="primary">Chờ phê duyệt</Button>
                                </>
                            ) : !inviteJoin && (
                                <Button onClick={() => handleJoinGroup(group.id)} icon={<Plus size={16} />} type="primary">
                                    Tham gia nhóm
                                </Button>
                            )
                        )}


                        {group.isMember && <Popover trigger={'click'} content={<div className="flex flex-col">
                            <Link to={`/groups/${group.id}/my-content/`} className="p-2 rounded-md hover:bg-gray-100 hover:text-black">Nội dung của bạn</Link>
                            {group.isMine &&
                                <Popconfirm onConfirm={handleRemoveGroup} title='Giải tán nhóm' description='Bạn có chắc là muốn giải tán nhóm?'>
                                    <button className="text-left p-2 rounded-md hover:bg-gray-100 hover:text-black">Giải tán nhóm</button>
                                </Popconfirm>
                            }
                            {!group.isMine &&
                                <button onClick={showReport} className="text-left p-2 rounded-md hover:bg-gray-100 hover:text-black">Báo cáo nhóm</button>
                            }
                        </div>}>
                            <Button icon={<MoreHorizontal size={16} />} type="primary">
                            </Button>
                        </Popover>
                        }
                    </div>

                </div>

                {inviteJoin?.status === false && <GroupInvitationLabel
                    invitation={inviteJoin}
                    group={group}
                    onAccept={() => handleAcceptInviteJoinGroup(inviteJoin.id)}
                    onReject={() => handleRejectInviteJoinGroup(inviteJoin.id)}
                />}

                {roleInvitation && <GroupRoleInvitationLabel
                    invitation={roleInvitation}
                    onAccept={() => handleAcceptRoleInvitation(roleInvitation.id)}
                    onReject={() => handleRejectRoleInvitation(roleInvitation.id)}
                />}

                <Divider className="my-3" />

                {group.isMember && <div className="flex gap-x-2 items-center">
                    <Link className={cn("md:px-4 px-2 py-2 rounded-md hover:bg-gray-100 hover:text-gray-600 text-gray-600 text-sm md:text-[16px] font-semibold", ['/members', '/videos', '/images'].every(route => !location.pathname.includes(route)) && 'border-b-[3px] border-primary bg-gray-100')} to={`/groups/${group.id}`}>Thảo luận</Link>
                    <Link className={cn("md:px-4 px-2 py-2 rounded-md hover:bg-gray-100 hover:text-gray-600 text-gray-600 text-sm md:text-[16px] font-semibold", location.pathname.includes('/members') && 'border-b-[3px] border-primary bg-gray-100')} to={`/groups/${group.id}/members`}>Thành viên</Link>
                    <Link className={cn("md:px-4 px-2 py-2 rounded-md hover:bg-gray-100 hover:text-gray-600 text-gray-600 text-sm md:text-[16px] font-semibold", location.pathname.includes('/images') && 'border-b-[3px] border-primary bg-gray-100')} to={`/groups/${group.id}/images`}>Ảnh</Link>
                    <Link className={cn("md:px-4 px-2 py-2 rounded-md hover:bg-gray-100 hover:text-gray-600 text-gray-600 text-sm md:text-[16px] font-semibold", location.pathname.includes('/videos') && 'border-b-[3px] border-primary bg-gray-100')} to={`/groups/${group.id}/videos`}>Video</Link>
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
                    isPublic: group.privacy === GroupPrivacy.PUBLIC
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
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <span className="text-sm mb-6">Ẩn nhóm (Chỉ thành viên hoặc người được mời mới tìm thấy nhóm)</span>
                                <Form.Item<EditGroupRequest>
                                    valuePropName="checked"
                                    name="isHidden"
                                >
                                    <Switch onChange={e => setIsDisabledSectionFriends(e)} disabled={isDisabled} />
                                </Form.Item>
                            </div>
                            <span className="text-xs mb-6 italic">Lưu ý: Khi ẩn nhóm, chỉ có Quản trị viên và người kiểm duyệt mới được phê duyệt thành viên</span>
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
                                <Switch disabled={isDisabled || isDisabledApprovalPost} />
                            </Form.Item>
                        </div>

                        <Form.Item<EditGroupRequest>
                            name="onlyAdminCanPost"
                            label='Ai có quyền đăng bài'
                        >
                            <Select
                                onChange={e => setIsDisabledApprovalPost(e.value)}
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
                                <Switch disabled={isDisabled || isDisabledSectionFriends} />
                            </Form.Item>
                        </div>

                        <Form.Item<EditGroupRequest>
                            name="onlyAdminCanApprovalMember"
                            label='Ai có quyền phê duyệt'
                        >
                            <Select
                                disabled={isDisabled || isDisabledSectionFriends}
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

        <Drawer classNames={{
            body: '!p-2',
        }} open={openManage} onClose={() => setOpenManage(false)} title='Quản lí nhóm'>
            {group?.isMine && <MyGroupManageSidebar group={group} />}
        </Drawer>

        <Modal
            title={<p className="text-center font-semibold text-xl">Rời nhóm</p>}
            open={openLeave}
            onOk={okLeave}
            onCancel={cancelLeave}
            okText='Rời nhóm'
            cancelText='Hủy bỏ'
            okButtonProps={{
                disabled: !selectMember,
                onClick: () => group && selectMember && void handleLeaveGroup(group.id, selectMember.id)
            }}
        >
            <ChooseNewAdminModal
                selectMember={selectMember}
                onChange={(newSelect) => setSelectMember(newSelect)}
                group={group}
            />
        </Modal>

        {/* REPORT TO ADMIN OF APP */}
        <Modal
            title={<p className="text-center font-bold text-lg">Báo cáo nhóm này</p>}
            centered
            open={openReport}
            onOk={okReport}
            onCancel={cancelReport}
            okText='Gửi báo cáo'
            cancelText='Hủy'
            okButtonProps={{
                onClick: () => reason.trim().length >= 20 && void handleReportGroup(),
                disabled: reason.trim().length < 20
            }}
        >
            <ReportPostModal
                value={reason}
                onChange={(newValue) => setReason(newValue)}
                title="Tại sao bạn báo cáo nhóm này"
                description="Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy tìm ngay sự giúp đỡ trước khi báo cáo với LinkUp."
            />
        </Modal>

    </div>
};

export default GroupHeader;
