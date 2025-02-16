import { FC } from "react";
import { GroupInvitationResource } from "../../../types/group-invitation";
import { Button } from "antd";
import { formatTimeMessage } from "../../../utils/date";
import { Link } from "react-router-dom";

type GroupPendingInviteProps = {
    invitation: GroupInvitationResource;
    onAccepted: () => void;
    onRejected: () => void
}

const GroupPendingInvite: FC<GroupPendingInviteProps> = ({
    invitation,
    onAccepted,
    onRejected
}) => {
    return <div className="p-4 rounded-lg shadow border-[1px] bg-white border-gray-100 w-full">
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
            <img className="w-[60px] h-[60px] object-cover rounded-md" src={invitation.group.coverImage} />

            <div className="flex flex-col">
                <span className="text-[16px] font-bold text-gray-700">{invitation.group.name}</span>

                <div className="flex items-center gap-x-1 text-sm">
                    <span>Được mời bởi: </span>
                    <Link to={`/profile/${invitation.inviter.id}`} className="font-semibold hover:text-black hover:underline">{invitation.inviter.fullName}</Link>
                   
                </div>
                <span className="text-xs font-se text-gray-500">Vào lúc {formatTimeMessage(new Date(invitation.dateCreated))}</span>
            </div>
        </div>

        <div className="flex flex-col gap-x-3 gap-y-2">
            <Button onClick={onAccepted} type="primary">Chấp nhận</Button>
            <button onClick={onRejected} className="px-3 py-[6px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                Từ chối
            </button>
        </div>
    </div>
</div>
};

export default GroupPendingInvite;
