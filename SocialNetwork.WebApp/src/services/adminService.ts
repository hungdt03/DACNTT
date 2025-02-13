import axiosInterceptor from "../configurations/axiosInterceptor";
import { SignUpRequest } from "../pages/auth/SignUpPage";
import { GroupResource } from "../types/group";
import { PostResource } from "../types/post";
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

     getAllUser() : Promise<DataResponse<UserResource[]>> {
               return axiosInterceptor.get('/api/admin/get-all-user')
     }
     getAllPost() : Promise<DataResponse<PostResource[]>> {
          return axiosInterceptor.get('/api/admin/get-all-post')
     }
     getAllGroup() : Promise<DataResponse<GroupResource[]>> {
          return axiosInterceptor.get('/api/admin/get-all-group')
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
}
export default AdminService.getInstance();