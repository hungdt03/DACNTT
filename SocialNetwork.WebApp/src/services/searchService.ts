
import { SearchPostFilterParams } from '../components/posts/SearchPostFilter';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { PostResource } from '../types/post';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';
import { SearchAllResource } from '../types/search/search-all';
import { SearchAllSuggestResource } from '../types/search/search-all-suggest';
import { SearchGroupSuggestResource } from '../types/search/search-group-suggest';
import { SearchHistoryResource } from '../types/search/search-history';
import { SearchUserSuggestResource } from '../types/search/search-user-suggest';

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

    searchPosts(query: string, page: number, size: number, filter?: SearchPostFilterParams) : Promise<PaginationResponse<PostResource[]>> {
        return axiosInterceptor.get('/api/search/posts', {
            params: {
                query,
                page,
                size,
                ...filter
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

    addSeachGroup(groupId: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/search/histories/group', { groupId });
    }

    addSearchUser(userId: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/search/histories/user', { userId });
    }

    addSearchTextPlain(text: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/search/histories/text', { text });
    }

    getUserSearchHistories(page: number, size: number) : Promise<PaginationResponse<SearchHistoryResource[]>> {
        return axiosInterceptor.get('/api/search/histories', {
            params: {
                page,
                size
            }
        })
    }

    removeSearchHistory(historyId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/search/histories/' + historyId);
    }

    removeAllSearchHistories() : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/search/histories');
    }
}

export default SearchService.getInstance();