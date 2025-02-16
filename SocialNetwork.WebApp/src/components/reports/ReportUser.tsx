import { FC } from "react";
import { ReportResource } from "../../types/report";
import { Avatar, Button } from "antd";
import { Link } from "react-router-dom";
import { GroupResource } from "../../types/group";
import { formatTimeMessage } from "../../utils/date";

type ReportUserProps = {
    group: GroupResource;
    report: ReportResource;
    onKeep: () => void;
    onRemove: () => void;
}

const ReportUser: FC<ReportUserProps> = ({
    group,
    report,
    onKeep,
    onRemove
}) => {
    return <div className="p-4 rounded-md shadow bg-white flex flex-col gap-y-4">
        <span className="text-[14px] text-gray-500 border-[1px] p-2">
            <Link className="font-bold hover:underline text-black" to={`/groups/${group.id}/user/${report.reporter.id}`}>{report.reporter.fullName + ' '}</Link>
            đã báo cáo <strong className="text-black">thành viên</strong> này vào lúc <strong>{formatTimeMessage(new Date(report.dateCreatedAt))} </strong> vì cho rằng:
            <strong className="text-black break-words">{' ' + report.reason}</strong>
        </span>

        <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-3">
                <Avatar size={'large'} src={report.targetUser.avatar} />
                <div className="flex flex-col gap-y-1">
                    <span className="font-semibold">{report.targetUser.fullName}</span>
                </div>
            </div>
            <div className="flex items-center justify-end gap-x-3">
                <Link to={`/groups/${group.id}/user/${report.targetUser.id}`}>
                    <Button type="primary">
                        Trang thành viên
                    </Button>
                </Link>
                <Button onClick={onKeep} type="primary">Giữ lại</Button>
                <button onClick={onRemove} className="py-[6px] text-sm px-4 rounded-md hover:bg-gray-200 bg-gray-100">Xóa khỏi nhóm</button>
            </div>
        </div>
    </div>
};

export default ReportUser;
