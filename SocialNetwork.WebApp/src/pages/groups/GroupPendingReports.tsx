import { FC, useEffect, useState } from "react";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import { useNavigate, useParams } from "react-router-dom";
import { Empty, message } from "antd";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ReportResource } from "../../types/report";
import reportService from "../../services/reportService";
import { ReportType } from "../../enums/report-type";
import ReportComment from "../../components/reports/ReportComment";
import ReportPost from "../../components/reports/ReportPost";
import ReportUser from "../../components/reports/ReportUser";
import { GroupResource } from "../../types/group";
import groupService from "../../services/groupService";

const GroupPendingReports: FC = ({
}) => {
    const { id } = useParams()
    const [pendingReports, setPendingReports] = useState<ReportResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const [group, setGroup] = useState<GroupResource>();

    const fetchGroup = async () => {
        if (id) {
            const response = await groupService.getGroupById(id);
            if (response.isSuccess) {
                setGroup(response.data)
            } else {
                navigate('/404')
            }
        }
    }

    useEffect(() => {
        fetchGroup();
    }, [id])

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchNextPage(),
        hasMore: pagination.hasMore,
        loading: loading,
        rootMargin: "10px",
        triggerId: "group-report-scroll-trigger",
    });

    const fetchPendingReports = async (groupId: string, page: number, size: number) => {
        setLoading(true);
        const response = await reportService.getGroupReports(groupId, page, size);
        console.log(response)
        setLoading(false);

        if (response.isSuccess) {
            setPagination(response.pagination);
            setPendingReports(prevReports => {
                const existingIds = new Set(prevReports.map(m => m.id));
                const newReports = response.data.filter(m => !existingIds.has(m.id));
                return [...prevReports, ...newReports];
            });
        }
    };

    const fetchNextPage = async () => {
        if (!pagination.hasMore || loading || !id) return;
        fetchPendingReports(id, pagination.page + 1, pagination.size);
    };

    const handleIgnoreReport = async (reportId: string) => {
        const response = await reportService.removeGroupReport(reportId);
        if (!response.isSuccess) message.error(response.message)
        else {
            setPendingReports(prevReports => [...prevReports.filter(r => r.id !== reportId)]);
        }
    }

    const handleRemoveComment = async (reportId: string) => {
        const response = await reportService.handleReportGroupComment(reportId);
        if (response.isSuccess) {
            message.success(response.message);
            setPendingReports(prevReports => [...prevReports.filter(r => r.id !== reportId)]);
        } else {
            message.error(response.message)
        }
    }

    const handleRemovePost = async (reportId: string) => {
        const response = await reportService.handleReportGroupPost(reportId);
        if (response.isSuccess) {
            message.success(response.message);
            setPendingReports(prevReports => [...prevReports.filter(r => r.id !== reportId)]);
        } else {
            message.error(response.message)
        }
    }

    const handleKickMember = async (reportId: string) => {
        const response = await reportService.handleReportGroupMember(reportId);
        if (response.isSuccess) {
            message.success(response.message)
            setPendingReports(prevReports => [...prevReports.filter(r => r.id !== reportId)]);
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        id && fetchPendingReports(id, pagination.page, pagination.size);
    }, [id])

    return <div className="w-full">
        <div className="w-full flex items-center justify-center bg-white shadow sticky top-0 z-10">
            <div className="max-w-screen-lg w-full py-3 flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                    <span className="text-xl font-bold">Đang chờ xử lí</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="text-xl font-bold">{pendingReports.length}</span>
                </div>
            </div>
        </div>

        {pendingReports.length === 0 && !loading && <div className="w-full h-full flex items-center justify-center">
            <Empty description='Không có báo cáo nào để xử lí' />
        </div>}
        <div ref={containerRef} className="w-full max-w-screen-lg mx-auto px-2 sm:px-0 grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {group && pendingReports.map(report => {
                if (report.reportType === ReportType.COMMENT) {
                    return <ReportComment
                        key={report.id}
                        report={report}
                        onKeep={() => handleIgnoreReport(report.id)}
                        onRemove={() => handleRemoveComment(report.id)}
                    />
                } else if (report.reportType === ReportType.POST) {
                    return <ReportPost
                        group={group}
                        key={report.id}
                        report={report}
                        onKeep={() => handleIgnoreReport(report.id)}
                        onRemove={() => handleRemovePost(report.id)}
                    />
                }

                return <ReportUser
                    group={group}
                    key={report.id}
                    report={report}
                    onKeep={() => handleIgnoreReport(report.id)}
                    onRemove={() => handleKickMember(report.id)}
                />
            })}

            <div className="col-span-2">
                {loading && <LoadingIndicator />}
                <div className="w-full h-1" id='group-report-scroll-trigger'></div>
            </div>
        </div>
    </div>
};

export default GroupPendingReports;
