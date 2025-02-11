import { FC } from "react";
import { Avatar, Button } from "antd";
import { GroupInvitationResource } from "../../types/group-invitation";

type GroupInvitationLabelProps = {
    invitation: GroupInvitationResource;
    onAccept: () => void;
    onReject: () => void;
}

const GroupInvitationLabel: FC<GroupInvitationLabelProps> = ({
    invitation,
    onAccept,
    onReject
}) => {
    return <div className="flex items-center w-full justify-between p-4 rounded-md bg-gray-100 mt-2">
        <div className="flex items-center gap-x-3">
            <Avatar src={invitation.inviter.avatar} size={'large'} />

            <div className="flex flex-col">
                <span className="font-bold">{invitation.inviter.fullName} đã mời bạn tham gia nhóm này</span>
                <p className="text-sm text-gray-500">
                    Nếu chấp nhận, bạn sẽ có thể thấy được mọi hoạt động của nhóm
                </p>
            </div>
        </div>
        <div className="flex items-center gap-x-2 flex-shrink-0">
            <Button onClick={onAccept} type="primary">Chấp nhận</Button>
            <button onClick={onReject} className="px-3 py-[6px] font-semibold bg-slate-200 hover:bg-slate-300 rounded-md text-sm">Từ chối</button>
        </div>
    </div>
};

export default GroupInvitationLabel;
