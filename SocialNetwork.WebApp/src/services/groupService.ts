
import { InviteFriendsRequest } from '../components/groups/GroupHeader';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { GroupResource } from '../types/group';
import { GroupApprovalSummaryResource } from '../types/group-approval-summary';
import { JoinGroupResource } from '../types/join-group';
import { BaseResponse, DataResponse } from '../types/response';


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

    inviteFriends(payload: InviteFriendsRequest) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/groups/invite-friends', payload)
    }

    acceptInviteFriend(inviteId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/invite-friends/accept/' + inviteId)
    }

    cancelInviteFriend(inviteId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/invite-friends/cancel/' + inviteId)
    }

    rejectInviteFriend(inviteId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/invite-friends/reject/' + inviteId)
    }

    createRequestJoinGroup(groupId: string) : Promise<DataResponse<JoinGroupResource>> {
        return axiosInterceptor.post('/api/groups/join/' + groupId)
    }

    approvalRequestJoinGroup(requestId: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/groups/approval/' + requestId)
    }

    getGroupApprovalSummary(groupId: string) : Promise<DataResponse<GroupApprovalSummaryResource>> {
        return axiosInterceptor.get('/api/groups/approval-summary/' + groupId)
    }
}

export default GroupService.getInstance();