
import axiosInterceptor from '../configurations/axiosInterceptor'
import { FriendResource } from '../types/friend';
import { InvitableFriendResource } from '../types/invitable-friend';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';
import { SuggestedFriendResource } from '../types/suggested-friend';

class FriendService {
    private static instance: FriendService;

    private constructor() { }

    public static getInstance(): FriendService {
        if (!FriendService.instance)
            FriendService.instance = new FriendService();
        return FriendService.instance;
    }

    getAllMyFriends(page: number, size: number) : Promise<PaginationResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/', {
            params: {
                page,
                size
            }
        })
    }

    getAllConnectFriends(query: string, page: number, size: number) : Promise<PaginationResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/connected-users', {
            params: {
                page,
                size,
                query
            }
        })
    }

    getAllInvitableConnectedUsers(chatRoomId: string, query: string, page: number, size: number) : Promise<PaginationResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/invitable-connected-users/' + chatRoomId, {
            params: {
                page,
                size,
                query
            }
        })
    }



    getAllFriendsByUserId(userId: string, page: number, size: number) : Promise<PaginationResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/' + userId, {
            params: {
                page,
                size
            }
        })
    }

    getInvitableFriends(groupId: string, query: string) : Promise<DataResponse<InvitableFriendResource[]>> {
        return axiosInterceptor.get('/api/friends/invitable/' + groupId, {
            params: {
                query
            }
        })
    }


    deleteFriend(friendId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/friends/'+ friendId)
    }

    getAllFriendsByFullName(fullName: string) : Promise<DataResponse<FriendResource[]>> {
        return axiosInterceptor.get('/api/friends/fullName?fullName=' + encodeURIComponent(fullName))
    }

    getSuggestedFriends(page: number, size: number) : Promise<PaginationResponse<SuggestedFriendResource[]>> {
        return axiosInterceptor.get('/api/friends/suggested', {
            params: {
                page,
                size
            }
        })
    }
 
}

export default FriendService.getInstance();