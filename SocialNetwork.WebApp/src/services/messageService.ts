
import axiosInterceptor from '../configurations/axiosInterceptor'
import { MessageResource } from '../types/message';
import { BaseResponse, DataResponse } from '../types/response';

class MessageService {
    private static instance: MessageService;

    private constructor() { }

    public static getInstance(): MessageService {
        if (!MessageService.instance)
            MessageService.instance = new MessageService();
        return MessageService.instance;
    }

    getAllMessagesByChatRoomId(chatRoomId: string) : Promise<DataResponse<MessageResource[]>> {
        return axiosInterceptor.get('/api/messages/' + chatRoomId)
    }

    sendMessage(formData: FormData) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/messages', formData)
    }

    readMessage(messageId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/messages/read/' + messageId)
    }
 
}

export default MessageService.getInstance();