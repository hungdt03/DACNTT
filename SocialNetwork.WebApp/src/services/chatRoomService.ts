
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

    getAllPendingChatRooms() : Promise<DataResponse<ChatRoomResource[]>> {
        return axiosInterceptor.get('/api/chatRooms/pending')
    }

    getChatRoomById(chatRoomId: string) : Promise<DataResponse<ChatRoomResource>> {
        return axiosInterceptor.get('/api/chatRooms/' + chatRoomId)
    }

    searchChatRoomByName(name: string) : Promise<DataResponse<ChatRoomResource[]>> {
        return axiosInterceptor.get('/api/chatRooms/search', {
            params: {
                name
            }
        })
    }

    getMediasByChatRoomId(chatRoomId: string, page: number, size: number) : Promise<PaginationResponse<MessageMediaResource[]>> {
        return axiosInterceptor.get('/api/chatRooms/medias/' + chatRoomId, {
            params: {
                page: page,  
                size: size  
            }
        })
    }

    getOrCreateChatRoom(receiverId: string) : Promise<DataResponse<ChatRoomResource>> {
        return axiosInterceptor.post('/api/chatRooms/get-or-create', {
            receiverId
        })
    }
 
}

export default ChatRoomService.getInstance();