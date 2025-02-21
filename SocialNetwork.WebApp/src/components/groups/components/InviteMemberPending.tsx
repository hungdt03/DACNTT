import { FC } from "react";
import images from "../../../assets";
import { Button } from "antd";
import { GroupInvitationResource } from "../../../types/group-invitation";

type InviteMemberPendingProps = {
    invitation: GroupInvitationResource;
    onReject: () => void;
    onApproval: () => void;
}

const InviteMemberPending: FC<InviteMemberPendingProps> = ({
    invitation,
    onReject,
    onApproval
}) => {
    return <div className="p-4 rounded-lg shadow border-[1px] bg-white border-gray-100 w-full">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
                <img className="w-[60px] h-[60px] object-cover rounded-full" src={invitation.invitee.avatar ?? images.cover} />

                <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-gray-700">{invitation.invitee.fullName}</span>

                    <div className="flex items-center gap-x-1 text-sm">
                        <span>Được mời bởi: </span>
                        <span className="font-semibold">{invitation.inviter.fullName}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-x-3 gap-y-2">
                <Button onClick={onApproval} type="primary">Phê duyệt</Button>
                <button onClick={onReject} className="px-3 py-[6px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                    Từ chối
                </button>
            </div>
        </div>
    </div>
};

export default InviteMemberPending;
