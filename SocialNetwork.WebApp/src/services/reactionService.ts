
import { ReactionRequest } from '../components/posts/Post';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { ReactionResource } from '../types/reaction';
import { BaseResponse, DataResponse } from '../types/response';


class ReactionService {
    private static instance: ReactionService;

    private constructor() { }

    public static getInstance(): ReactionService {
        if (!ReactionService.instance)
            ReactionService.instance = new ReactionService();
        return ReactionService.instance;
    }


    saveReaction(payload: ReactionRequest): Promise<BaseResponse> {
        return axiosInterceptor.post('/api/reactions', payload)
    }

    getAllReactionsByPostId(postId: string) : Promise<DataResponse<ReactionResource[]>> {
        return axiosInterceptor.get('/api/reactions/post/' + postId)
    }
 
}

export default ReactionService.getInstance();