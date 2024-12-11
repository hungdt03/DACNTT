
import axiosInterceptor from '../configurations/axiosInterceptor'
import { FriendResource } from '../types/friend';
import { BaseResponse, DataResponse } from '../types/response';

class FriendService {
    private static instance: FriendService;

    private constructor() { }

    public static getInstance(): FriendService {
        if (!FriendService.instance)
            FriendService.instance = new FriendService();
        return FriendService.instance;
    }

    getTopSixOfUserFriends(friendId: string) : Promise<DataResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/top-six/'+ friendId)
    }

    deleteFriend(friendId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/friends/'+ friendId)
    }
 
}

export default FriendService.getInstance();