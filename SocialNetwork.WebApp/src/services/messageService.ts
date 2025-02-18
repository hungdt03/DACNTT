
import axiosInterceptor from '../configurations/axiosInterceptor'
import { MessageResource } from '../types/message';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';

class MessageService {
    private static instance: MessageService;

    private constructor() { }

    public static getInstance(): MessageService {
        if (!MessageService.instance)
            MessageService.instance = new MessageService();
        return MessageService.instance;
    }

    getAllMessagesByChatRoomId(chatRoomId: string, page: number, size: number): Promise<PaginationResponse<MessageResource[]>> {
        return axiosInterceptor.get('/api/messages/' + chatRoomId, {
            params: {
                page: page,
                size: size
            }
        })
    }

    sendMessage(formData: FormData): Promise<DataResponse<MessageResource>> {
        return axiosInterceptor.post('/api/messages', formData)
    }

    readMessage(chatRoomId: string): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/messages/read/' + chatRoomId)
    }

}

export default MessageService.getInstance();