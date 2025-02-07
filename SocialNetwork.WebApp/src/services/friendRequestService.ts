
import axiosInterceptor from '../configurations/axiosInterceptor'
import { FriendRequestResource } from '../types/friendRequest';
import { BaseResponse, DataResponse } from '../types/response';


class FriendRequestService {
    private static instance: FriendRequestService;

    private constructor() { }

    public static getInstance(): FriendRequestService {
        if (!FriendRequestService.instance)
            FriendRequestService.instance = new FriendRequestService();
        return FriendRequestService.instance;
    }


    createFriendRequest(receiverId: string): Promise<BaseResponse> {
        return axiosInterceptor.post('/api/friend-requests', { receiverId })
    }

    acceptFriendRequest(requestId: string): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/friend-requests/accepted/' + requestId)
    }

    cancelFriendRequest(requestId: string): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/friend-requests/cancelled/' + requestId)
    }

    getFriendRequestByUserId(userId: string) : Promise<DataResponse<FriendRequestResource>> {
        return axiosInterceptor.get('/api/friend-requests/'+ userId)
    }
    getAllFriendRequestByUserId(userId: string) : Promise<DataResponse<FriendRequestResource[]>> {
        return axiosInterceptor.get('/api/friend-requests/get-allrequest/'+ userId)
    }
 
}

export default FriendRequestService.getInstance();