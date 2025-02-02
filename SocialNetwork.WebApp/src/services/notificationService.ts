
import axiosInterceptor from '../configurations/axiosInterceptor'
import { NotificationResource } from '../types/notification';
import { BaseResponse, PaginationResponse } from '../types/response';
import { PaginationParams } from '../utils/pagination';

class FriendService {
    private static instance: FriendService;

    private constructor() { }

    public static getInstance(): FriendService {
        if (!FriendService.instance)
            FriendService.instance = new FriendService();
        return FriendService.instance;
    }

    getAllNotifications(params: PaginationParams) : Promise<PaginationResponse<NotificationResource[]>> {
        return axiosInterceptor.get('/api/notifications/', {
            params: {
                page: params.page,
                size: params.size
            }
        })
    }

    markNotificationAsRead(notificationId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/notifications/' + notificationId)
    }

    deleteNotification(notificationId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/notifications/' + notificationId)
    }
}

export default FriendService.getInstance();