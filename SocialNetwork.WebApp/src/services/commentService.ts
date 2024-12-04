
import axiosInterceptor from '../configurations/axiosInterceptor'
import { CommentResource } from '../types/comment';
import { DataResponse, PaginationResponse } from '../types/response';


class CommentService {
    private static instance: CommentService;

    private constructor() { }

    public static getInstance(): CommentService {
        if (!CommentService.instance)
            CommentService.instance = new CommentService();
        return CommentService.instance;
    }


    createComment(payload: FormData): Promise<DataResponse<CommentResource>> {
        return axiosInterceptor.post('/api/comments', payload)
    }

    getAllRootCommentsByPostId(postId: string, page: number, size: number) : Promise<PaginationResponse<CommentResource[]>> {
        return axiosInterceptor.get('/api/comments/post/' + postId, {
            params: {
                page: page,  
                size: size  
            }
        })
    }
 
    getAllRepliesByCommentId(commentId: string, page: number, size: number): Promise<PaginationResponse<CommentResource[]>> {
        return axiosInterceptor.get('/api/comments/replies/' + commentId, {
            params: {
                page: page,  
                size: size  
            }
        });
    }
}

export default CommentService.getInstance();