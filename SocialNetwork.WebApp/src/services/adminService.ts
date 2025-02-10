import axiosInterceptor from "../configurations/axiosInterceptor";
import { GroupResource } from "../types/group";
import { PostResource } from "../types/post";
import { DataResponse } from "../types/response";
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
}
export default AdminService.getInstance();