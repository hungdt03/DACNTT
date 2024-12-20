
import axiosInterceptor from '../configurations/axiosInterceptor'
import { ChatRoomResource } from '../types/chatRoom';
import { DataResponse } from '../types/response';

class ChatRoomService {
    private static instance: ChatRoomService;

    private constructor() { }

    public static getInstance(): ChatRoomService {
        if (!ChatRoomService.instance)
            ChatRoomService.instance = new ChatRoomService();
        return ChatRoomService.instance;
    }

    getAllChatRooms() : Promise<DataResponse<ChatRoomResource[]>> {
        return axiosInterceptor.get('/api/chatRooms/')
    }
 
}

export default ChatRoomService.getInstance();