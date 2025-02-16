import { FC } from "react";
import { ReportResource } from "../../types/report";
import { Link } from "react-router-dom";
import { Avatar, Button, Divider, Tooltip } from "antd";
import images from "../../assets";
import { extractContentFromJSON } from "../comments/CommentItem";
import { formatTime, formatTimeMessage, formatVietnamDate } from "../../utils/date";

type ReportCommentProps = {
    report: ReportResource;
    onKeep: () => void;
    onRemove: () => void;
}

const ReportComment: FC<ReportCommentProps> = ({
    report,
    onKeep,
    onRemove
}) => {
    return <div className="p-4 rounded-md shadow bg-white flex flex-col gap-y-4">
        <span className="text-[14px] text-gray-500 border-[1px] p-2">
            <Link className="font-bold hover:underline text-black" to={`/profile/${report.reporter.id}`}>{report.reporter.fullName + ' '}</Link>
            đã báo cáo <strong className="text-black">bình luận</strong> này lúc <strong>{formatTimeMessage(new Date(report.dateCreatedAt))} </strong> vì cho rằng:
            <strong className="text-black">{' ' + report.reason}</strong>
        </span>

        <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
                {!report.targetPost?.user.haveStory
                    ? <Avatar className="w-10 h-10 flex-shrink-0" src={report.targetComment?.user.avatar ?? images.user} />
                    : <Link className="p-[1px] border-[2px] border-primary rounded-full" to={`/stories/${report.targetComment?.user.id}`}><Avatar className="w-9 h-9 flex-shrink-0" src={report.targetComment?.user.avatar ?? images.user} /></Link>
                }
                <div className="flex flex-col">
                    <Link to={`/profile/${report.targetComment?.user.id}`}>{report.targetComment?.user?.fullName}</Link>
                    <Tooltip title={formatVietnamDate(new Date(report.targetComment?.createdAt))}>
                        <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(report.targetComment?.createdAt))}</span>
                    </Tooltip>
                </div>
            </div>

            <p>{extractContentFromJSON(report.targetComment.content)}</p>
        </div>

        <Divider className="my-0" />

        <div className="flex items-center justify-end gap-x-3">
            <Button onClick={onKeep} type="primary">Giữ lại</Button>
            <button onClick={onRemove} className="py-[6px] text-sm px-4 rounded-md hover:bg-gray-200 bg-gray-100">Gỡ bình luận</button>
        </div>
    </div>
};

export default ReportComment;
