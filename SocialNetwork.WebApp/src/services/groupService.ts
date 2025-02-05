
import { InviteFriendsRequest } from '../components/groups/GroupHeader';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { GroupResource } from '../types/group';
import { GroupApprovalSummaryResource } from '../types/group-approval-summary';
import { GroupMemberResource } from '../types/group-member';
import { JoinGroupRequestResource, JoinGroupResource } from '../types/join-group';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';


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

    cancelRequestJoinGroup(requestId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/cancel/' + requestId)
    }

    rejectRequestJoinGroup(requestId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/reject/' + requestId)
    }

    getGroupApprovalSummary(groupId: string) : Promise<DataResponse<GroupApprovalSummaryResource>> {
        return axiosInterceptor.get('/api/groups/approval-summary/' + groupId)
    }

    getJoinGroupRequestByGroupId(groupId: string) : Promise<DataResponse<JoinGroupRequestResource>> {
        return axiosInterceptor.get('/api/groups/join/' + groupId)
    }

    getAllJoinGroupRequestByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<JoinGroupRequestResource[]>> {
        return axiosInterceptor.get('/api/groups/pending-requests/' + groupId, {
            params: {
                page,
                size
            }
        })
    }

    getAllMembersByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<GroupMemberResource[]>> {
        return axiosInterceptor.get('/api/groups/members/' + groupId, {
            params: {
                page,
                size
            }
        })
    }

    getAllNonAdminMembersByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<GroupMemberResource[]>> {
        return axiosInterceptor.get('/api/groups/members-non-admins/' + groupId, {
            params: {
                page,
                size
            }
        })
    }

    updateGeneralInfo(groupId: string, payload: any) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/' + groupId, payload)
    }

    kickMember(memberId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/groups/kick/' + memberId)
    }

    leaveGroup(groupId: string, memberId: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/groups/leave-group', {
            groupId,
            memberId
        })
    }

    inviteAsAdmin(memberId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/invite-role-admin/' + memberId)
    }

    inviteAsModerator(memberId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/invite-role-moderator/' + memberId)
    }

    acceptRoleInvitation(invitationId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/accept-invite-role/' + invitationId)
    }

    cancelRoleInvitation(memberId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/cancel-invite-role/' + memberId)
    }

    rejectRoleInvitation(invitationId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/reject-invite-role/' + invitationId)
    }
}

export default GroupService.getInstance();