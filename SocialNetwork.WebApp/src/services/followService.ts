
import axiosInterceptor from '../configurations/axiosInterceptor'
import { BaseResponse, DataResponse } from '../types/response';
import { UserResource } from '../types/user';


class FollowService {
    private static instance: FollowService;

    private constructor() { }

    public static getInstance(): FollowService {
        if (!FollowService.instance)
            FollowService.instance = new FollowService();
        return FollowService.instance;
    }

    getAllFollowersByUserId(userId: string) : Promise<DataResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/follows/followers/' + userId)
    }

    getAllFolloweesByUserId(userId: string) : Promise<DataResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/follows/followees/' + userId)
    }


    followUser(followeeId: string): Promise<BaseResponse> {
        return axiosInterceptor.post('/api/follows', { followeeId })
    }

    unfollowUser(followeeId: string): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/follows/unfollow/' + followeeId)
    }

    checkFollowUser(followeeId: string) : Promise<DataResponse<boolean>> {
        return axiosInterceptor.get('/api/follows/check/' + followeeId)
    }
}

export default FollowService.getInstance();