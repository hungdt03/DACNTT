
import axiosInterceptor from '../configurations/axiosInterceptor'
import { StoryRequest } from '../pages/CreateStoryPage';
import { BaseResponse, DataResponse } from '../types/response';
import { StoryResource } from '../types/story';
import { UserStoryResource } from '../types/userStory';


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
}

export default StoryService.getInstance();