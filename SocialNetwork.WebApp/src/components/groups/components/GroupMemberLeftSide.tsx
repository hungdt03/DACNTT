import { UserGroupIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { GroupMemberResource } from "../../../types/group-member";
import { GroupResource } from "../../../types/group";
import { Button, message, Modal, Tag } from "antd";
import { Link } from "react-router-dom";
import useModal from "../../../hooks/useModal";
import ReportPostModal from "../../modals/reports/ReportPostModal";
import reportService from "../../../services/reportService";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { MemberRole } from "../../../enums/member-role";
import { formatDateStandard } from "../../../utils/date";
import { getRoleGroupTitle } from "../../../utils/role";

type GroupMemberLeftSideProps = {
    member: GroupMemberResource;
    group: GroupResource
}

const GroupMemberLeftSide: FC<GroupMemberLeftSideProps> = ({
    member,
    group
}) => {
    const { user } = useSelector(selectAuth)
    const [reason, setReason] = useState('');
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal();

    const handleReportMember = async () => {
        const response = await reportService.reportUser(member.user.id, reason, group.id);
        if (response.isSuccess) {
            message.success(response.message);
            setReason('')
            handleOk()
        } else {
            message.error(response.message)
        }
    }

    return <div className="col-span-5 h-full overflow-y-auto scrollbar-hide flex flex-col gap-y-2 lg:gap-y-4">
        <div className="p-4 rounded-md bg-white shadow flex flex-col gap-y-2">
            <span className="text-lg font-bold">Giới thiệu</span>
            <div className="flex flex-col items-center gap-y-3">
                <div className="relative">
                    {!member.user.haveStory
                        ? <img className="w-[80px] h-[80px] object-cover rounded-full border-[1px]" src={member.user.avatar} />
                        : <Link className="inline-block p-[1px] border-[4px] border-primary rounded-full" to={`/stories/${member.user.id}`}><img className="w-[78px] h-[78px] p-[2px] object-cover rounded-full border-[1px]" src={member.user.avatar} /></Link>
                    }

                    {member.user.isShowStatus && member.user.isOnline && <div className="absolute bottom-0 right-0 p-2 rounded-full border-[2px] border-white bg-green-500"></div>}
                </div>
                <span className="text-xl font-bold">{member.user.fullName}</span>
                <Tag color="green">{getRoleGroupTitle(member.role as MemberRole)}</Tag>
            </div>
            <div className="flex items-start gap-x-3">
                <UserGroupIcon width={25} className="flex-shrink-0" color="gray" />
                <span>Tham gia nhóm vào ngày {formatDateStandard(new Date(member.joinDate))}</span>
            </div>
            <div className="flex justify-center items-center gap-x-3">
                <Link to={`/profile/${member.user.id}`}>
                    <Button type="primary">Trang cá nhân</Button>
                </Link>
                {!group.isMine && member.user.id !== user?.id && member.role !== MemberRole.ADMIN && <button onClick={showModal} className="py-[7px] px-3 rounded-md bg-gray-100 hover:bg-gray-200 text-sm">Báo cáo</button>}
            </div>
        </div>
        
        {/* REPORT TO ADMIN OF APP */}
        <Modal
            title={<p className="text-center font-bold text-lg">Báo cáo {member.user.fullName} tới quản trị viên</p>}
            centered
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Gửi báo cáo'
            cancelText='Hủy'
            okButtonProps={{
                onClick: () => reason.trim().length >= 20 && void handleReportMember(),
                disabled: reason.trim().length < 20
            }}
        >
            <ReportPostModal
                value={reason}
                onChange={(newValue) => setReason(newValue)}
                title="Tại sao bạn báo cáo người này này"
                description="Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy tìm ngay sự giúp đỡ trước khi báo cáo với chúng tôi."
            />
        </Modal>
    </div>
};

export default GroupMemberLeftSide;
