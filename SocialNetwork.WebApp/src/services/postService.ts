import { EditSharePostRequest } from '../components/modals/EditSharePostModal';
import { SharePostRequest } from '../components/modals/SharePostModal';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { PendingPostsFilter } from '../pages/groups/GroupPendingPosts';
import { PostMediaResource, PostResource } from '../types/post';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';
import { PrivacyType } from '../enums/privacy';
import { ProfilePostFilter } from '../components/posts/ProfilePostFilter';


class PostService {
    private static instance: PostService;

    private constructor() { }

    public static getInstance(): PostService {
        if (!PostService.instance)
            PostService.instance = new PostService();
        return PostService.instance;
    }


    createPost(payload: FormData): Promise<DataResponse<PostResource>> {
        return axiosInterceptor.post('/api/posts', payload)
    }

    changePrivacy(postId: string, privacyType: PrivacyType) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/posts/change-privacy', { postId, privacyType })
    }

    revokeTag(postId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/posts/revoke-tag/' + postId)
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

    getAllPostsByPrincipal(page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/principal', {
            params: {
                page: page,  
                size: size  
            }
        })
    }

    getAllPostsByUserId(userId: string, page: number, size: number, filterParam?: ProfilePostFilter) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/user/' + userId, {
            params: {
                page: page,  
                size: size,
                ...filterParam
            }
        })
    }

    getAllPostsByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/group/' + groupId, {
            params: {
                page: page,  
                size: size  
            }
        })
    }

    getAllMemberPostsInGroup(memberId: string, page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/group/member/' + memberId, {
            params: {
                page: page,  
                size: size  
            }
        })
    }

    getAllGroupPostsByCurrentUser(page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/group', {
            params: {
                page: page,  
                size: size  
            }
        })
    }

    getGroupPostMediaByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<PostMediaResource[]>> {
        return axiosInterceptor.get('/api/posts/media/group/' + groupId, {
            params: {
                page: page,  
                size: size  
            }
        })
    }

    getAllPendingPostsByGroupId(groupId: string, page: number, size: number, query: string, filtering: PendingPostsFilter) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/group/pending/' + groupId, {
            params: {
                page: page,  
                size: size,
                date: filtering.date,
                userId: filtering.author?.id,
                sortOrder: filtering.sortOrder,
                contentType: filtering.contentType,
                query
            }
        })
    }

    getAllSharesByPostId(postId: string, page: number, size: number)  : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/share/' + postId, {
            params: {
                page: page,  
                size: size  
            }
        })
    }

    getPostById(postId: string) : Promise<DataResponse<PostResource>> {
        return axiosInterceptor.get('/api/posts/' + postId)
    }

    sharePost(payload: SharePostRequest) : Promise<DataResponse<PostResource>> {
        return axiosInterceptor.post('/api/posts/share', payload)
    }

    editSharePost(postId: string, payload: EditSharePostRequest): Promise<BaseResponse> {
        return axiosInterceptor.put('/api/posts/share/' + postId, payload)
    }

    deletePost(postId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/posts/' + postId)
    }

    approvalPostByGroupIdAndPostId(groupId: string, postId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/posts/group/approval/' + groupId + '/' + postId)
    }

    rejectPostByGroupIdAndPostId(groupId: string, postId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/posts/group/reject/' + groupId + '/' + postId)
    }

    getUserSavedPosts(page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/saved-posts', {
            params: {
                page,
                size
            }
        })
    }

    addSavedPost(postId: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/posts/saved-posts', { postId })
    }

    removeSavedPostByPostId(postId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/posts/saved-posts/' + postId)
    }

 
    getAllMyPendingPostsByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/group/pending-posts/' + groupId, {
            params: {
                page: page,  
                size: size,
            }
        })
    }

    getAllMyRejectedPostsByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/group/rejected-posts/' + groupId, {
            params: {
                page: page,  
                size: size,
            }
        })
    }

    getAllMyApprovalPostsByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/posts/group/approval-posts/' + groupId, {
            params: {
                page: page,  
                size: size,
            }
        })
    }
}

export default PostService.getInstance();