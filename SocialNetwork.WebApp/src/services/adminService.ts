import { MonthlyRegistrationStatsResource } from './../types/monthly-registration-stats';
import axiosInterceptor from "../configurations/axiosInterceptor";
import { GroupAdminResponse, GroupResource } from "../types/group";
import { PostResource } from "../types/post";
import { ReportResource } from "../types/report";
import { BaseResponse, DataResponse, PaginationResponse } from "../types/response";
import { UserResource } from "../types/user";
import { PostQueryFilter } from '../pages/admin/posts/PostPageManagement';
import { GroupMemberResource } from '../types/group-member';
import { PostTabQueryFilter } from '../pages/admin/groups/GroupPostTabs';
import { FriendResource } from '../types/friend';
import { UserPostTabQueryFilter } from '../pages/admin/users/UserPostTabs';
import { UpdateReport } from '../pages/admin/reports/ReportPageManagement';
import { StatisticResource } from '../types/statistic';
import { TrendingPostResource } from '../types/trending-post';


class AdminService {
    private static instance: AdminService;

    private constructor() { }

    public static getInstance(): AdminService {
        if (!AdminService.instance)
            AdminService.instance = new AdminService();
        return AdminService.instance;
    }
    //USER
    getAllUser(page: number, size: number, search: string): Promise<PaginationResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/admin/get-all-user', {
            params: {
                page,
                size,
                search
            }
        })
    }

    getAllAdmins(page: number, size: number, search: string): Promise<PaginationResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/admin/get-all-admin', {
            params: {
                page,
                size,
                search
            }
        })
    }

    getAllPostByUserId(userId: string, page: number, size: number, filter: UserPostTabQueryFilter): Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/admin/users/posts/' + userId, {
            params: {
                page,
                size,
                ...filter
            }
        })
    }


    getAllFriendsByUserId(userId: string, page: number, size: number, search: string): Promise<PaginationResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/admin/users/friends/' + userId, {
            params: {
                page,
                size,
                search
            }
        })
    }

    getAllFollowersByUserId(userId: string, page: number, size: number, search: string): Promise<PaginationResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/admin/users/followers/' + userId, {
            params: {
                page,
                size,
                search
            }
        })
    }


    getAllFolloweesByUserId(userId: string, page: number, size: number, search: string): Promise<PaginationResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/admin/users/followees/' + userId, {
            params: {
                page,
                size,
                search
            }
        })
    }


    getUserById(userId: string) : Promise<DataResponse<UserResource>> {
        return axiosInterceptor.get('/api/admin/users/' + userId)
    }

    lockAndUnlockManyAccount(listUserId: string[], number: string): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/admin/lock-users', { listUserId: listUserId, number: number })
    }

    lockAndUnlockOneAccount(userId: string): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/admin/lock-users/' + userId)
    }

    DeleteOneAccount(userId: string): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-user/' + userId)
    }

    DeleteManyAccount(listUserId: string[]): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-many-user', { data: listUserId })
    }

    DeleteAllAccount(): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-all-user')
    }

    GetAllUserConnection(): Promise<DataResponse<number>> {
        return axiosInterceptor.get('/api/admin/get-all-user-connection')
    }

    GetRegistrationStatsByYear(year: number): Promise<DataResponse<MonthlyRegistrationStatsResource[]>> {
        return axiosInterceptor.get('/api/admin/get-registration-stats-by-year/' + year)
    }

    GetTop1Followers(): Promise<DataResponse<UserResource>> {
        return axiosInterceptor.get('/api/admin/get-top1-followers')
    }

    getStatistics() : Promise<DataResponse<StatisticResource>> {
        return axiosInterceptor.get('/api/admin/statistics')
    }

    getTopTrendingPosts(type: string, from?: Date, to?: Date) : Promise<DataResponse<TrendingPostResource[]>> {
        return axiosInterceptor.get('/api/admin/get-top-trending-posts', {
            params: {
                type,
                from,
                to
            }
        })
    }

    //POSt
    getAllPost(page: number, size: number, filter: PostQueryFilter): Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/admin/get-all-post', {
            params: {
                page,
                size,
                ...filter
            }
        })
    }

    DeleteOnePost(postId: string): Promise<DataResponse<PostResource>> {
        return axiosInterceptor.delete('/api/admin/delete-post/' + postId)
    }

    DeleteManyPost(listPostId: string[]): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-many-post', { data: listPostId })
    }

    DeleteAllPost(): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-all-post')
    }
    

    //GROUP
    getAllGroup(page: number, size: number, search: string, privacy: string): Promise<PaginationResponse<GroupResource[]>> {
        return axiosInterceptor.get('/api/admin/get-all-group', {
            params: {
                page,
                size, 
                search,
                privacy
            }
        })
    }

    getGroupById(groupId: string) : Promise<DataResponse<GroupAdminResponse>> {
        return axiosInterceptor.get('/api/admin/groups/' + groupId)
    }

    getAllMembersByGroupId(groupId: string, page: number, size: number, search?: string, role?: string) : Promise<PaginationResponse<GroupMemberResource[]>> {
        return axiosInterceptor.get('/api/admin/groups/members/' + groupId, {
            params: {
                page,
                size,
                search, 
                role
            }
        })
    }

    getAllPostsByGroupId(groupId: string, page: number, size: number, filter?: PostTabQueryFilter) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/admin/groups/posts/' + groupId, {
            params: {
                page,
                size,
                search: filter?.search,
                authorId: filter?.author?.id,
                contentType: filter?.contentType,
                sortOrder: filter?.sortOrder,
                fromDate: filter?.fromDate,
                toDate: filter?.toDate,
            }
        })
    }


    DeleteOneGroup(groupId: string): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-group/' + groupId)
    }
    DeleteManyGroup(listGroupId: string[]): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-many-group', { data: listGroupId })
    }
    DeleteAllGroup(): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-all-group')
    }
    CountAllGroup(): Promise<DataResponse<number>> {
        return axiosInterceptor.get('/api/admin/count-all-group')
    }
    //REPORT
    getAllReport(page: number, size: number, status: string, type: string): Promise<PaginationResponse<ReportResource[]>> {
        return axiosInterceptor.get('/api/admin/get-all-report', {
            params: {
                page,
                size,
                status,
                type
            }
        })
    }
    DeleteOneReport(reportId: string): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-report/' + reportId)
    }
    DeleteManyReport(listReportId: string[]): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-many-report', { data: listReportId })
    }
    DeleteAllReport(): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/admin/delete-all-report')
    }
    UpdateReport(payload: UpdateReport): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/admin/update-report', payload)
    }
    GetReportById(reportId: string): Promise<DataResponse<ReportResource>> {
        return axiosInterceptor.get('/api/admin/get-report-by-id/' + reportId)
    }
    
    // COMMENT
    DeleteOneComment(commentId: string): Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/comments/' + commentId)
    }
}
export default AdminService.getInstance();