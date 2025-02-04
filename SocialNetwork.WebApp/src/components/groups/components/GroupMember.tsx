import { FC } from "react";
import { GroupMemberResource } from "../../../types/group-member";
import images from "../../../assets";
import { formatTime } from "../../../utils/date";
import { MemberRole } from "../../../enums/member-role";
import { Button, Divider, Popconfirm, Tag } from "antd";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";

type GroupMemberProps = {
    member: GroupMemberResource;
    isMine: boolean;
    adminCount: number;
    countMember: number;
    onKickMember?: () => void;
    onChooseNewAdmin?: () => void;
    onLeaveGroup?: () => void;
}

const GroupMember: FC<GroupMemberProps> = ({
    member,
    isMine,
    adminCount,
    countMember,
    onKickMember,
    onChooseNewAdmin,
    onLeaveGroup
}) => {
    const { user } = useSelector(selectAuth)
    return <div className="p-4 rounded-lg shadow border-[1px] bg-white border-gray-100 w-full flex flex-col">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
                <img className="w-[50px] h-[50px] object-cover rounded-full" src={member.user.avatar ?? images.cover} />

                <div className="flex flex-col items-start gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <span className="text-[16px] font-bold text-gray-700">{member.user.fullName}</span>
                        {member.role === MemberRole.ADMIN ? <Tag color="cyan">Quản trị viên</Tag> : member.role === MemberRole.MODERATOR && <Tag color="green">Người kiểm duyệt</Tag>}
                    </div>
                    <span className="text-sm text-gray-500">Tham gia nhóm {formatTime(new Date(member.joinDate))}</span>
                </div>
            </div>
        </div>

        <Divider className="my-4" />

        <div className="flex justify-end items-center gap-x-2">
            {isMine && member.user.id !== user?.id && member.role !== MemberRole.MEMBER && <Button size="small" type="primary">Gỡ quyền</Button>}
            {user?.id === member.user.id ? (
                isMine && adminCount === 1 && countMember > 1 ? <button onClick={onChooseNewAdmin} className="px-3 py-[3px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                    Rời nhóm
                </button>
                    : <Popconfirm onConfirm={onLeaveGroup} title='Rời nhóm' cancelText='Hủy bỏ' okText='Xóa' description={countMember === 1 ? 'Bạn là thành viên cuối cùng của nhóm, nhóm sẽ bị xóa khi bạn rời đi!' : 'Bạn có chắc muốn rời nhóm không'}>
                        <button className="px-3 py-[3px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                            Rời nhóm
                        </button>
                    </Popconfirm>
            ) : <Popconfirm onConfirm={onKickMember} title='Xóa thành viên' cancelText='Hủy bỏ' okText='Xóa' description='Bạn có chắc là sẽ xóa thành viên này khỏi nhóm'>
                <button className="px-3 py-[3px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                    Xóa khỏi nhóm
                </button>
            </Popconfirm>}
        </div>
    </div>
};

export default GroupMember;
