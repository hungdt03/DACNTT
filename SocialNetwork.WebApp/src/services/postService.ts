
import { PostForm } from '../components/modals/CreatePostModal';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { PostResource } from '../types/post';
import { BaseResponse, DataResponse } from '../types/response';


class PostService {
    private static instance: PostService;

    private constructor() { }

    public static getInstance(): PostService {
        if (!PostService.instance)
            PostService.instance = new PostService();
        return PostService.instance;
    }


    createPost(payload: FormData): Promise<BaseResponse> {
        return axiosInterceptor.post('/api/posts', payload)
    }

    getAllPosts() : Promise<DataResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts')
    }
 
}

export default PostService.getInstance();