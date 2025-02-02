
import { ReactStory } from '../components/story/StoryShow';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { StoryRequest } from '../pages/CreateStoryPage';
import { BaseResponse, DataResponse } from '../types/response';
import { UserStoryResource } from '../types/userStory';
import { ViewerResource } from '../types/viewer';


class StoryService {
    private static instance: StoryService;

    private constructor() { }

    public static getInstance(): StoryService {
        if (!StoryService.instance)
            StoryService.instance = new StoryService();
        return StoryService.instance;
    }

    getAllStories() : Promise<DataResponse<UserStoryResource[]>> {
        return axiosInterceptor.get('/api/stories')
    }

    createStory(payload: StoryRequest) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/stories', payload)
    }

    viewStory(storyId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/stories/view/' + storyId)
    }

    reactToStory(payload: ReactStory) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/stories/react', payload);
    }

    getMyStoryViews(storyId: string) : Promise<DataResponse<ViewerResource[]>> {
        return axiosInterceptor.get('/api/stories/viewers/' + storyId)
    }

    getUserStoryByUserId(userId: string) : Promise<DataResponse<UserStoryResource>> {
        return axiosInterceptor.get('/api/stories/' + userId)
    }

    deleteStoryById(storyId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/stories/' + storyId)
    }
}

export default StoryService.getInstance();