import { FC } from "react";
import { GroupRoleInvitationResource } from "../../types/group-role-invitation";
import { Avatar, Button } from "antd";
import { MemberRole } from "../../enums/member-role";

type GroupRoleInvitationLabelProps = {
    invitation: GroupRoleInvitationResource;
    onAccept: () => void;
    onReject: () => void;
}

const GroupRoleInvitationLabel: FC<GroupRoleInvitationLabelProps> = ({
    invitation,
    onAccept,
    onReject
}) => {
    return <div className="flex items-center w-full justify-between p-4 rounded-md bg-gray-100 mt-2">
        <div className="flex items-center gap-x-3">
            <Avatar src={invitation.inviter.avatar} size={'large'} />

            <div className="flex flex-col">
                <span className="font-bold">{invitation.inviter.fullName} đã mời bạn làm {invitation.role === MemberRole.ADMIN ? 'Quản trị viên' : 'Người kiểm duyệt'} của nhóm này</span>
                <p className="text-sm text-gray-500">
                    {invitation.role === MemberRole.MODERATOR ? 'Nếu chấp nhận, bạn sẽ có thể phê duyệt hoặc từ chối yêu cầu làm thành viên, bài viết' : 'Nếu chấp nhận, bạn sẽ có thể phê duyệt hoặc từ chối yêu cầu làm thành viên, gỡ bài viết và bình luận, xóa thành viên khỏi nhóm, v.v. '}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-x-2 flex-shrink-0">
            <Button onClick={onAccept} type="primary">Chấp nhận</Button>
            <button onClick={onReject} className="px-3 py-[6px] font-semibold bg-slate-200 hover:bg-slate-300 rounded-md text-sm">Từ chối</button>
        </div>
    </div>
};

export default GroupRoleInvitationLabel;
