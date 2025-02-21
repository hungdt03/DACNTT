import { MonthlyRegistrationStatsResource } from './../types/monthly-registration-stats';
import { UpdateReport } from "../components/dialogs/UpdateReportDialog";
import axiosInterceptor from "../configurations/axiosInterceptor";
import { GroupResource } from "../types/group";
import { PostResource } from "../types/post";
import { ReportResource } from "../types/report";
import { BaseResponse, DataResponse } from "../types/response";
import { UserResource } from "../types/user";
import { UserScoreResource } from "../types/userScore";


class AdminService {
     private static instance: AdminService;

     private constructor() { }

     public static getInstance(): AdminService {
        if (!AdminService.instance)
          AdminService.instance = new AdminService();
        return AdminService.instance;
     }
     //USER
     getAllUser() : Promise<DataResponse<UserResource[]>> {
               return axiosInterceptor.get('/api/admin/get-all-user')
     }
     lockAndUnlockManyAccount(listUserId: string[], number:string) : Promise<BaseResponse> {
          return axiosInterceptor.put('/api/admin/lock-users', { listUserId: listUserId, number: number })
     }
     lockAndUnlockOneAccount(userId: string) : Promise<BaseResponse> {
          return axiosInterceptor.put('/api/admin/lock-users/' + userId)
     }
     DeleteOneAccount(userId: string) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-user/' + userId)
     }
     DeleteManyAccount(listUserId: string[]) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-many-user', { data: listUserId })
     }
     DeleteAllAccount() : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-all-user')
     }
     CountAllUser() : Promise<DataResponse<number>> {
          return axiosInterceptor.get('/api/admin/count-all-user')
     }
     CountAllUserIsLock() : Promise<DataResponse<number>> {
          return axiosInterceptor.get('/api/admin/count-all-user-islock')
     }
     GetAllUserConnection() : Promise<DataResponse<number>> {
          return axiosInterceptor.get('/api/admin/get-all-user-connection')
     }
     GetTop10UserScore() : Promise<DataResponse<UserScoreResource[]>> {
          return axiosInterceptor.get('/api/admin/get-top-10-user-score')
     }
     GetYear() : Promise<DataResponse<number[]>> {
          return axiosInterceptor.get('/api/admin/get-year')
     }
     GetRegistrationStatsByYear(year : number) : Promise<DataResponse<MonthlyRegistrationStatsResource[]>> {
          return axiosInterceptor.get('/api/admin/get-registration-stats-by-year/'+year)
     }
     GetTop1Followers() : Promise<DataResponse<UserResource>> {
          return axiosInterceptor.get('/api/admin/get-top1-followers')
     }
     //POSt
     getAllPost() : Promise<DataResponse<PostResource[]>> {
          return axiosInterceptor.get('/api/admin/get-all-post')
     }
     DeleteOnePost(postId : string) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-post/' + postId)
     }
     DeleteManyPost(listPostId: string[]) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-many-post', { data: listPostId })
     }
     DeleteAllPost() : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-all-post')
     }
     CountAllPost() : Promise<DataResponse<number>> {
          return axiosInterceptor.get('/api/admin/count-all-post')
     }
     //GROUP
     getAllGroup() : Promise<DataResponse<GroupResource[]>> {
          return axiosInterceptor.get('/api/admin/get-all-group')
     }
     DeleteOneGroup(groupId : string) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-group/' + groupId)
     }
     DeleteManyGroup(listGroupId: string[]) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-many-group', { data: listGroupId })
     }
     DeleteAllGroup() : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-all-group')
     }
     CountAllGroup() : Promise<DataResponse<number>> {
          return axiosInterceptor.get('/api/admin/count-all-group')
     }
     //REPORT
     getAllReport() : Promise<DataResponse<ReportResource[]>> {
          return axiosInterceptor.get('/api/admin/get-all-report')
     }
     DeleteOneReport(reportId : string) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-report/' + reportId)
     }
     DeleteManyReport(listReportId: string[]) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-many-report', { data: listReportId })
     }
     DeleteAllReport() : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/admin/delete-all-report')
     }
     UpdateReport(payload : UpdateReport ) : Promise<BaseResponse> {
          return axiosInterceptor.put('/api/admin/update-report',payload)
     }
     GetReportById(reportId : string ) : Promise<DataResponse<ReportResource>> {
          return axiosInterceptor.get('/api/admin/get-report-by-id/'+reportId)
     }
     CountAllReport() : Promise<DataResponse<number>> {
          return axiosInterceptor.get('/api/admin/count-all-report')
     }
     // COMMENT
     DeleteOneComment(commentId : string) : Promise<BaseResponse> {
          return axiosInterceptor.delete('/api/comments/' + commentId)
     }
}
export default AdminService.getInstance();