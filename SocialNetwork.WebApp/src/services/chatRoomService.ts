
import { CreateChatRoomRequest } from '../components/modals/CreateGroupChatModal';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { ChatRoomResource } from '../types/chatRoom';
import { BaseResponse, DataResponse } from '../types/response';

class ChatRoomService {
    private static instance: ChatRoomService;

    private constructor() { }

    public static getInstance(): ChatRoomService {
        if (!ChatRoomService.instance)
            ChatRoomService.instance = new ChatRoomService();
        return ChatRoomService.instance;
    }

    createChatRoom(payload: CreateChatRoomRequest) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/chatRooms', payload)
    }

    getAllChatRooms() : Promise<DataResponse<ChatRoomResource[]>> {
        return axiosInterceptor.get('/api/chatRooms/')
    }

    getChatRoomById(chatRoomId: string) : Promise<DataResponse<ChatRoomResource>> {
        return axiosInterceptor.get('/api/chatRooms/' + chatRoomId)
    }
 
}

export default ChatRoomService.getInstance();