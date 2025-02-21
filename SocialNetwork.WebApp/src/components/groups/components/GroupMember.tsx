import { FC } from "react";
import { GroupMemberResource } from "../../../types/group-member";
import images from "../../../assets";
import { formatTime } from "../../../utils/date";
import { MemberRole } from "../../../enums/member-role";
import { Button, Divider, Popconfirm, Popover, Tag } from "antd";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { MoreHorizontal } from "lucide-react";
import { GroupResource } from "../../../types/group";
import { Link } from "react-router-dom";

type GroupMemberProps = {
    group: GroupResource;
    member: GroupMemberResource;
    isMine: boolean;
    adminCount: number;
    countMember: number;
    onKickMember?: () => void;
    onChooseNewAdmin?: () => void;
    onRevokeRole?: () => void;
    onLeaveGroup?: () => void;
    onInviteAsAdmin?: () => void;
    onInviteAsModerator?: () => void;
    onCancelInviteAsAdmin?: () => void;
    onCancelInviteAsModerator?: () => void;
}

const GroupMember: FC<GroupMemberProps> = ({
    group,
    member,
    isMine,
    adminCount,
    countMember,
    onKickMember,
    onChooseNewAdmin,
    onLeaveGroup,
    onInviteAsAdmin,
    onInviteAsModerator,
    onCancelInviteAsAdmin,
    onCancelInviteAsModerator,
    onRevokeRole
}) => {
    const { user } = useSelector(selectAuth)
    return <div className="relative p-4 rounded-lg shadow border-[1px] bg-white border-gray-100 w-full flex flex-col">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
                <img className="w-[50px] h-[50px] object-cover rounded-full" src={member.user.avatar ?? images.cover} />

                <div className="flex flex-col items-start gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <Link to={`/groups/${group.id}/user/${member.user.id}`} className="text-[16px] font-bold text-gray-700">{member.user.fullName}</Link>
                        {member.role === MemberRole.ADMIN ? <Tag color="cyan">Quản trị viên</Tag> : member.role === MemberRole.MODERATOR && <Tag color="green">Người kiểm duyệt</Tag>}
                    </div>
                    <span className="text-sm text-gray-500">Tham gia nhóm {formatTime(new Date(member.joinDate))}</span>
                </div>
            </div>
        </div>

        <Divider className="my-4" />

        <div className="flex justify-end items-center gap-x-2">

            {isMine && member.user.id !== user?.id && member.role !== MemberRole.MEMBER && <Button onClick={onRevokeRole} size="small" type="primary">Gỡ quyền</Button>}
            {user?.id === member.user.id ? (
                isMine && adminCount === 1 && countMember > 1 ? <button onClick={onChooseNewAdmin} className="px-3 py-[3px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                    Rời nhóm
                </button>
                    : <Popconfirm onConfirm={onLeaveGroup} title='Rời nhóm' cancelText='Hủy bỏ' okText='Rời' description={countMember === 1 ? 'Bạn là thành viên cuối cùng của nhóm, nhóm sẽ bị xóa khi bạn rời đi!' : 'Bạn có chắc muốn rời nhóm không'}>
                        <button className="px-3 py-[3px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                            Rời nhóm
                        </button>
                    </Popconfirm>
            ) : isMine && <Popconfirm onConfirm={onKickMember} title='Xóa thành viên' cancelText='Hủy bỏ' okText='Xóa' description='Bạn có chắc là sẽ xóa thành viên này khỏi nhóm'>
                <button className="px-3 py-[3px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                    Xóa khỏi nhóm
                </button>
            </Popconfirm>}
        </div>

        {member.user.id !== user?.id && isMine && member.role !== MemberRole.ADMIN && (
            <Popover
                trigger="hover"
                content={
                    <div className="flex flex-col items-start">
                        {member.isInvitedAsAdmin ? (
                            // Nếu đã mời làm Admin → Hiển thị nút "Gỡ lời mời làm Quản trị viên", ẩn nút mời/gỡ lời mời Moderator
                            <button
                                onClick={onCancelInviteAsAdmin}
                                className="w-full px-2 py-2 rounded-md hover:bg-gray-100 text-sm text-left"
                            >
                                Gỡ lời mời làm Quản trị viên
                            </button>
                        ) : member.isInvitedAsModerator ? null : (
                            // Nếu chưa có lời mời nào → Hiển thị nút "Mời làm Quản trị viên"
                            <button
                                onClick={onInviteAsAdmin}
                                className="w-full px-2 py-2 rounded-md hover:bg-gray-100 text-sm text-left"
                            >
                                Mời làm quản trị viên
                            </button>
                        )}

                        {member.isInvitedAsModerator ? (
                            // Nếu đã mời làm Moderator → Hiển thị nút "Gỡ lời mời làm Người kiểm duyệt", ẩn nút mời/gỡ lời mời Admin
                            <button
                                onClick={onCancelInviteAsModerator}
                                className="w-full px-2 py-2 rounded-md hover:bg-gray-100 text-sm text-left"
                            >
                                Gỡ lời mời làm Người kiểm duyệt
                            </button>
                        ) : member.isInvitedAsAdmin ? null :  member.role === MemberRole.MEMBER && (
                            // Nếu chưa có lời mời nào → Hiển thị nút "Mời làm Người kiểm duyệt"
                            <button
                                onClick={onInviteAsModerator}
                                className="w-full px-2 py-2 rounded-md hover:bg-gray-100 text-sm text-left"
                            >
                                Mời làm người kiểm duyệt
                            </button>
                        )}
                    </div>
                }
            >
                <button className="absolute right-4 top-4 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <MoreHorizontal size={18} className="text-gray-500" />
                </button>
            </Popover>
        )}

    </div>
};

export default GroupMember;
