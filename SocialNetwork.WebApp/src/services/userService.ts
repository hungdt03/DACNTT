
import axiosInterceptor from '../configurations/axiosInterceptor'
import { DataResponse } from '../types/response';
import { UserResource } from '../types/user';


class UserService {
    private static instance: UserService;

    private constructor() { }

    public static getInstance(): UserService {
        if (!UserService.instance)
            UserService.instance = new UserService();
        return UserService.instance;
    }

    getUserById(userId: string) : Promise<DataResponse<UserResource>> {
        return axiosInterceptor.get('/api/users/' + userId)
    }
}

export default UserService.getInstance();