import { FC } from "react";
import { ReportResource } from "../../../types/report";
import ReportPostItem from "./ReportPostItem";
import { Avatar, Button, Divider, Popconfirm, Tag } from "antd";
import { formatDateStandard, formatDateTimeStandard } from "../../../utils/date";
import ReportCommentItem from "./ReportCommentItem";
import errors from "../../../assets/error";
import ReportUserItem from "./ReportUserItem";
import ReportGroupItem from "./ReportGroupItem";

type ResolveReportModalProps = {
    report: ReportResource;
    onRemove: () => void;
    onKeep: () => void;
}

const ResolveReportModal: FC<ResolveReportModalProps> = ({
    report,
    onRemove,
    onKeep
}) => {


    return <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        <div className="w-full h-full grid grid-cols-2">
            <div className="p-4 flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold">Nội dung bị báo cáo</span>
                    {
                        report.status === 'PENDING' ? <Tag color="gold">Chờ xử lí</Tag>
                            : report.status === 'RESOLVED' ? <Tag color="cyan">Đã xử lí</Tag>
                                : <Tag color="lime">Giữ nguyên nội dung</Tag>
                    }
                </div>
                {report.status === 'RESOLVED' ? <div className="w-full h-full flex flex-col gap-y-2 items-center justify-center">
                    <img width={40} className="object-cover" src={errors.postNotFound} />
                    <p className="text-[15px] text-gray-500">Nội dung đã bị gỡ bỏ</p>
                </div> :

                    <div className="p-3 border-[1px] rounded-md border-gray-100">
                        {report.reportType === 'POST' && <ReportPostItem post={report.targetPost} />}
                        {report.reportType === 'COMMENT' && <ReportCommentItem comment={report.targetComment} />}
                        {report.reportType === 'USER' && <ReportUserItem user={report.targetUser} />}
                        {report.reportType === 'GROUP' && <ReportGroupItem group={report.targetGroup} />}
                    </div>
                }
            </div>

            <div className="p-4 flex flex-col gap-y-2">
                <span className="text-[15px] font-bold">Người báo cáo</span>
                <div className="border-[1px] border-gray-300 bg-slate-50 p-3 flex items-center gap-x-3 rounded-md">
                    <Avatar size={'large'} src={report.reporter.avatar} />
                    <div className="flex flex-col">
                        <span className="font-bold">{report.reporter.fullName}</span>
                        <span className="text-xs">Vào lúc {formatDateTimeStandard(new Date(report.dateCreatedAt))}</span>
                    </div>
                </div>
                <span className="text-[15px] font-bold">Loại báo cáo</span>
                <div className="border-[1px] border-gray-300 bg-slate-50 p-3 flex items-center gap-x-3 rounded-md">
                    <span className="font-bold">
                        {report.reportType === 'COMMENT' && 'Bình luận'}
                        {report.reportType === 'USER' && 'Người dùng'}
                        {report.reportType === 'GROUP' && 'Nhóm'}
                        {report.reportType === 'POST' && 'Bài viết'}
                    </span>
                </div>
                <span className="text-[15px] font-bold">Lí do báo cáo</span>
                <div className="border-[1px] border-gray-300 bg-slate-50 p-3 rounded-md">
                    {report.reason}
                </div>
                <Divider className="my-0" />
                {report.status === 'PENDING' ? <>
                    <span className="text-[15px] font-bold">Hướng giải quyết</span>
                    {
                        (!report.targetComment && !report.targetGroup && !report.targetPost && !report.targetUser)
                            ? <p>Nội dung cần xử lí không tồn tại</p> : <div className="flex items-center gap-x-2">
                                <Popconfirm onConfirm={onKeep} title='Cảnh báo' description='Bạn có chắc chắn với hướng giải quyết này' cancelText='Hủy bỏ'>
                                    <Button type="primary">Giữ lại</Button>
                                </Popconfirm>
                                <Popconfirm onConfirm={onRemove} title='Cảnh báo' description='Bạn có chắc chắn với hướng giải quyết này' cancelText='Hủy bỏ'>
                                    <Button danger type="primary">
                                        {report.reportType === "USER" && 'Khóa tài khoản'}
                                        {report.reportType === 'GROUP' && 'Giải tán nhóm'}  
                                        {(report.reportType === 'COMMENT' || report.reportType === 'POST') && 'Gỡ nội dung'}  
                                    </Button>
                                </Popconfirm>
                            </div>
                    }

                </>
                    : <div className="flex flex-col gap-y-2">
                        <span className="text-[15px] font-bold">Nội dung phản hồi</span>
                        <p className="p-3 rounded-md bg-slate-50 border-[1px]">{report.resolutionNotes ?? 'Chúng tôi đã xử lí theo chính sách'}</p>
                    </div>
                }

            </div>
        </div>
    </div>
};

export default ResolveReportModal;
