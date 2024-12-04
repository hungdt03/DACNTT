
import axiosInterceptor from '../configurations/axiosInterceptor'
import { FriendRequestResource } from '../types/friendRequest';
import { BaseResponse, DataResponse } from '../types/response';

class FriendService {
    private static instance: FriendService;

    private constructor() { }

    public static getInstance(): FriendService {
        if (!FriendService.instance)
            FriendService.instance = new FriendService();
        return FriendService.instance;
    }

    deleteFriend(friendId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/friends/'+ friendId)
    }
 
}

export default FriendService.getInstance();