
import axiosInterceptor from '../configurations/axiosInterceptor'
import { CommentMentionPaginationResource, CommentResource } from '../types/comment';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';

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

    getNearbyCommentsByCommentId(postId: string, commentId?: string) : Promise<CommentMentionPaginationResource> {
        return axiosInterceptor.get('/api/comments/nearby/' + postId + "/" + commentId)
    }

    getPrevComments(postId: string, parentCommentId: string | null, page: number) : Promise<CommentMentionPaginationResource> {
        return axiosInterceptor.get('/api/comments/prev/' + postId, {
            params: {
                page: page,
                parentCommentId
            }
        })
    }

    getNextComments(postId: string, parentCommentId: string | null, page: number) : Promise<CommentMentionPaginationResource> {
        return axiosInterceptor.get('/api/comments/next/' + postId, {
            params: {
                page: page,
                parentCommentId
            }
        })
    }

    deleteCommentById(commentId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/comments/' + commentId)
    }
    getCommentByIdIgnore(commentId: string) : Promise<DataResponse<CommentResource>> {
        return axiosInterceptor.delete('/api/comments/ignore/' + commentId)
    }
}

export default CommentService.getInstance();