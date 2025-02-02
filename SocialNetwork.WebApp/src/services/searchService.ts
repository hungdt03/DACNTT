
import axiosInterceptor from '../configurations/axiosInterceptor'
import { GroupResource } from '../types/group';
import { PostResource } from '../types/post';
import { DataResponse, PaginationResponse } from '../types/response';
import { SearchAllResource } from '../types/search/search-all';
import { SearchAllSuggestResource } from '../types/search/search-all-suggest';
import { SearchGroupSuggestResource } from '../types/search/search-group-suggest';
import { SearchUserSuggestResource } from '../types/search/search-user-suggest';
import { UserResource } from '../types/user';

class SearchService {
    private static instance: SearchService;

    private constructor() { }

    public static getInstance(): SearchService {
        if (!SearchService.instance)
            SearchService.instance = new SearchService();
        return SearchService.instance;
    }

    searchAll(query: string) : Promise<DataResponse<SearchAllResource>> {
        return axiosInterceptor.get('/api/search', {
            params: {
                query
            }
        })
    }

    searchAllSuggestion(query: string) : Promise<DataResponse<SearchAllSuggestResource>> {
        return axiosInterceptor.get('/api/search/suggest', {
            params: {
                query
            }
        })
    }

    searchUsers(query: string, page: number, size: number) : Promise<PaginationResponse<SearchUserSuggestResource[]>> {
        return axiosInterceptor.get('/api/search/users', {
            params: {
                query,
                page,
                size
            }
        })
    }

    searchPosts(query: string, page: number, size: number) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/search/posts', {
            params: {
                query,
                page,
                size
            }
        })
    }

    searchGroups(query: string, page: number, size: number) : Promise<PaginationResponse<SearchGroupSuggestResource[]>> {
        return axiosInterceptor.get('/api/search/groups', {
            params: {
                query,
                page,
                size
            }
        })
    }
}

export default SearchService.getInstance();