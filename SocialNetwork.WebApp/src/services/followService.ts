
import axiosInterceptor from '../configurations/axiosInterceptor'
import { FriendRequestResource } from '../types/friendRequest';
import { BaseResponse, DataResponse } from '../types/response';


class FollowService {
    private static instance: FollowService;

    private constructor() { }

    public static getInstance(): FollowService {
        if (!FollowService.instance)
            FollowService.instance = new FollowService();
        return FollowService.instance;
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