
import axiosInterceptor from '../configurations/axiosInterceptor'
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';
import { UserResource } from '../types/user';


class FollowService {
    private static instance: FollowService;

    private constructor() { }

    public static getInstance(): FollowService {
        if (!FollowService.instance)
            FollowService.instance = new FollowService();
        return FollowService.instance;
    }

    getAllFollowersByUserId(userId: string, page: number, size: number) : Promise<PaginationResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/follows/followers/' + userId, {
            params: {
                page, 
                size
            }
        })
    }

    getAllFolloweesByUserId(userId: string, page: number, size: number) : Promise<PaginationResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/follows/followees/' + userId, {
            params: {
                page, 
                size
            }
        })
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