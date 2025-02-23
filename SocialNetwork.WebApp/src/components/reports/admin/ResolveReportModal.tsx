import { FC } from "react";
import { ReportResource } from "../../../types/report";
import ReportPostItem from "./ReportPostItem";
import { Avatar, Button, Divider, Popconfirm, Tag } from "antd";
import { formatDateStandard } from "../../../utils/date";

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
                    <Tag color="cyan">Đã xử lí</Tag>
                </div>
                <div className="p-3 border-[1px] rounded-md border-gray-100">
                    {report.reportType === 'POST' && <ReportPostItem post={report.targetPost} />}
                </div>
            </div>

            <div className="p-4 flex flex-col gap-y-2">
                <span className="text-[15px] font-bold">Người báo cáo</span>
                <div className="border-[1px] border-gray-300 bg-slate-50 p-3 flex items-center gap-x-3 rounded-md">
                    <Avatar size={'large'} src={report.reporter.avatar} />
                    <div className="flex flex-col">
                        <span className="font-bold">{report.reporter.fullName}</span>
                        <span className="text-xs">Vào lúc {formatDateStandard(new Date(report.dateCreatedAt))}</span>
                    </div>
                </div>
                <span className="text-[15px] font-bold">Lí do báo cáo</span>
                <div className="border-[1px] border-gray-300 bg-slate-50 p-3 rounded-md">
                    {report.reason}
                </div>
                <Divider className="my-0" />
                <span className="text-[15px] font-bold">Hướng giải quyết</span>
                <div className="flex items-center gap-x-2">
                    <Popconfirm onConfirm={onKeep} title='Cảnh báo' description='Bạn có chắc chắn với hướng giải quyết này' cancelText='Hủy bỏ'>
                        <Button type="primary">Giữ lại</Button>
                    </Popconfirm>
                    <Popconfirm onConfirm={onRemove} title='Cảnh báo' description='Bạn có chắc chắn với hướng giải quyết này'  cancelText='Hủy bỏ'>
                        <Button danger type="primary">
                            {report.reportType === "USER" ?
                                'Khóa tài khoản'
                                : report.reportType === 'GROUP' ? 'Giải tán nhóm'
                                    : 'Gỡ nội dung'
                            }
                        </Button>
                    </Popconfirm>
                </div>

            </div>
        </div>
    </div>
};

export default ResolveReportModal;
