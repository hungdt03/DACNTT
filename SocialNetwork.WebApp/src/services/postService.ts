

import { EditSharePostRequest } from '../components/modals/EditSharePostModal';
import { SharePostRequest } from '../components/modals/SharePostModal';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { PostResource } from '../types/post';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';


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

    editPost(postId: string, payload: FormData): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/posts/' + postId, payload)
    }

    getAllPosts(page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts', {
            params: {
                page: page,  
                size: size  
            }
        })
    }

    getPostById(postId: string) : Promise<DataResponse<PostResource>> {
        return axiosInterceptor.get('/api/posts/' + postId)
    }

    sharePost(payload: SharePostRequest) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/posts/share', payload)
    }

    editSharePost(postId: string, payload: EditSharePostRequest): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/posts/share/' + postId, payload)
    }

 
}

export default PostService.getInstance();