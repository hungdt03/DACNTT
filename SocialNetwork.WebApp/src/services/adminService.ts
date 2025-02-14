import axiosInterceptor from "../configurations/axiosInterceptor";
import { SignUpRequest } from "../pages/auth/SignUpPage";
import { GroupResource } from "../types/group";
import { PostResource } from "../types/post";
import { ReportResource } from "../types/report";
import { BaseResponse, DataResponse } from "../types/response";
import { UserResource } from "../types/user";


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
}
export default AdminService.getInstance();