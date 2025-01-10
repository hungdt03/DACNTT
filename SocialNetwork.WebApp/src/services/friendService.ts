
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

    getAllFriends() : Promise<DataResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/')
    }

    getTopNineOfUserFriends(friendId: string) : Promise<DataResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/top-nine-user-friend/'+ friendId)
    }

    getTopNineOfMyFriends() : Promise<DataResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/top-nine-my-friend/')
    }


    deleteFriend(friendId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/friends/'+ friendId)
    }

    getAllFriendsByFullName(fullName: string) : Promise<DataResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/fullName?fullName=' + encodeURIComponent(fullName))
    }
 
}

export default FriendService.getInstance();