import { FC } from "react";
import images from "../../../assets";
import { Button } from "antd";
import { JoinGroupRequestResource } from "../../../types/join-group";
import { formatTime } from "../../../utils/date";
import { Link } from "react-router-dom";

type PendingMemberProps = {
    request: JoinGroupRequestResource;
    onReject: () => void;
    onApproval: () => void;
}

const PendingMember: FC<PendingMemberProps> = ({
    request,
    onReject,
    onApproval
}) => {
    return <div className="p-4 rounded-lg shadow border-[1px] bg-white border-gray-100 w-full">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
                <img className="w-[60px] h-[60px] object-cover rounded-full" src={request.user.avatar ?? images.cover} />

                <div className="flex flex-col">
                    <Link to={`/profile/${request.user.id}`} className="text-[16px] hover:underline font-bold text-gray-700 hover:text-gray-700">{request.user.fullName}</Link>
                    <span className="text-[14px] text-gray-500">Đã yêu cầu {formatTime(new Date(request.requestDate))}</span>
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

export default PendingMember;
