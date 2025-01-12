
import { CreateChatRoomRequest } from '../components/modals/CreateGroupChatModal';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { ChatRoomResource } from '../types/chatRoom';
import { MessageMediaResource } from '../types/message';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';

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

    getMediasByChatRoomId(chatRoomId: string, page: number, size: number) : Promise<PaginationResponse<MessageMediaResource[]>> {
        return axiosInterceptor.get('/api/chatRooms/medias/' + chatRoomId, {
            params: {
                page: page,  
                size: size  
            }
        })
    }
 
}

export default ChatRoomService.getInstance();