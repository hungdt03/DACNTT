
import axiosInterceptor from '../configurations/axiosInterceptor'
import { ReportResource } from '../types/report';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';

class ReportService {
    private static instance: ReportService;

    private constructor() { }

    public static getInstance(): ReportService {
        if (!ReportService.instance)
         ReportService.instance = new ReportService();
        return ReportService.instance;
    }

    getReportById(reportId: string) : Promise<DataResponse<ReportResource>> {
        return axiosInterceptor.get('/api/reports/' + reportId)
    }

    reportUser(userId: string, reason: string, groupId?: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/reports/user', { userId, reason, groupId })
    }

    reportComment(commentId: string, reason: string, groupId?: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/reports/comment', { commentId, reason, groupId })
    }

    reportPost(postId: string, reason: string, groupId?: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/reports/post', { postId, reason, groupId })
    }

    reportGroup(groupId: string, reason: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/reports/group', { reason, groupId })
    }

    getGroupReports(groupId: string, page: number, size: number) : Promise<PaginationResponse<ReportResource[]>> {
        return axiosInterceptor.get('/api/reports/groups/pending/' + groupId, {
            params: {
                page,
                size
            }
        })
    }

    handleReportGroupComment(reportId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/reports/group/comment/' + reportId)
    }

    handleReportGroupPost(reportId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/reports/group/post/' + reportId)
    }

    handleReportGroupMember(reportId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/reports/group/member/' + reportId)
    }

    removeGroupReport(reportId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/reports/group/' + reportId)
    }
}

export default ReportService.getInstance();