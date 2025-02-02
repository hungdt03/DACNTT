
import axiosInterceptor from '../configurations/axiosInterceptor'
import { DataResponse } from '../types/response';
import { SearchAllResource } from '../types/search/search-all';
import { SearchAllSuggestResource } from '../types/search/search-all-suggest';
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

    searchUsers(query: string) : Promise<DataResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/search/users', {
            params: {
                query
            }
        })
    }

    searchPosts(query: string) : Promise<DataResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/search/posts', {
            params: {
                query
            }
        })
    }

    searchGroups(query: string) : Promise<DataResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/search/groups', {
            params: {
                query
            }
        })
    }
}

export default SearchService.getInstance();