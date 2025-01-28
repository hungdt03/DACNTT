
import axiosInterceptor from '../configurations/axiosInterceptor'
import { GroupResource } from '../types/group';
import { DataResponse } from '../types/response';


class GroupService {
    private static instance: GroupService;

    private constructor() { }

    public static getInstance(): GroupService {
        if (!GroupService.instance)
            GroupService.instance = new GroupService();
        return GroupService.instance;
    }

    createGroup (form: FormData) : Promise<DataResponse<string>> {
        return axiosInterceptor.post('/api/groups', form)
    }

    getAllJoinGroup() : Promise<DataResponse<GroupResource[]>> {
        return axiosInterceptor.get('/api/groups/join')
    }

    getAllManageGroup() : Promise<DataResponse<GroupResource[]>> {
        return axiosInterceptor.get('/api/groups/manage')
    }

    getGroupById(groupId: string) : Promise<DataResponse<GroupResource>> {
        return axiosInterceptor.get('/api/groups/' + groupId)
    }
}

export default GroupService.getInstance();