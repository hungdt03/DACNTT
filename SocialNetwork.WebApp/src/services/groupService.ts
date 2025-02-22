
import { InviteFriendsRequest } from '../components/groups/GroupHeader';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { RoleFilter } from '../pages/groups/GroupMemberPage';
import { GroupResource } from '../types/group';
import { GroupApprovalSummaryResource } from '../types/group-approval-summary';
import { GroupInvitationResource } from '../types/group-invitation';
import { GroupMemberResource } from '../types/group-member';
import { GroupRoleInvitationResource } from '../types/group-role-invitation';
import { JoinGroupRequestResource, JoinGroupResource } from '../types/join-group';
import { PostMediaResource } from '../types/post';
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

    getGroupMemberByGroupIdAndUserId(groupId: string, userId: string) : Promise<DataResponse<GroupMemberResource>> {
        return axiosInterceptor.get('/api/groups/member/' + groupId + '/' + userId)
    }

    getAllManageGroup() : Promise<DataResponse<GroupResource[]>> {
        return axiosInterceptor.get('/api/groups/manage')
    }

    getGroupById(groupId: string) : Promise<DataResponse<GroupResource>> {
        return axiosInterceptor.get('/api/groups/' + groupId)
    }
    getGroupByIdIgnore(groupId: string) : Promise<DataResponse<GroupResource>> {
        return axiosInterceptor.get('/api/groups/ignore/' + groupId)
    }

    getInviteJoinGroup(groupId: string) : Promise<DataResponse<GroupInvitationResource>> {
        return axiosInterceptor.get('/api/groups/invite-join/' + groupId)
    }

    inviteFriends(payload: InviteFriendsRequest) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/groups/invite-friends', payload)
    }

    acceptInviteFriend(inviteId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/invite-friends/accept/' + inviteId)
    }

    adminAcceptInviteFriend(inviteId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/invite-friends/admin-accept/' + inviteId)
    }

    adminRejectInviteFriend(inviteId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/invite-friends/admin-reject/' + inviteId)
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

    getAllPendingInvitesByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<GroupInvitationResource[]>> {
        return axiosInterceptor.get('/api/groups/pending-invites/' + groupId, {
            params: {
                page,
                size
            }
        })
    }

    getAllJoinGroupRequestByGroupId(groupId: string, page: number, size: number) : Promise<PaginationResponse<JoinGroupRequestResource[]>> {
        return axiosInterceptor.get('/api/groups/pending-requests/' + groupId, {
            params: {
                page,
                size
            }
        })
    }

    getAllMembersByGroupId(groupId: string, page: number, size: number, query?: string, role?: RoleFilter) : Promise<PaginationResponse<GroupMemberResource[]>> {
        return axiosInterceptor.get('/api/groups/members/' + groupId, {
            params: {
                page,
                size,
                query,
                role
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

    getAllPendingInvitesByCurrentUser(page: number, size: number) : Promise<PaginationResponse<GroupInvitationResource[]>> {
        return axiosInterceptor.get('/api/groups/pending-invites', {
            params: {
                page,
                size
            }
        })
    }

    uploadCoverImage(formData: FormData) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/groups/upload-cover', formData)
    }

    updateGeneralInfo(groupId: string, payload: any) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/' + groupId, payload)
    }

    kickMember(memberId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/groups/kick/' + memberId)
    }

    leaveGroup(groupId: string, memberId?: string) : Promise<BaseResponse> {
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

    getAllGroupImagesByGroupId(groupId: string, page: number, size:  number) : Promise<PaginationResponse<PostMediaResource[]>> {
        return axiosInterceptor.get('/api/groups/medias/images/' + groupId, {
            params: {
                page,
                size
            }
        })
    }

    getAllGroupVideosByGroupId(groupId: string, page: number, size:  number) : Promise<PaginationResponse<PostMediaResource[]>> {
        return axiosInterceptor.get('/api/groups/medias/videos/' + groupId, {
            params: {
                page,
                size
            }
        })
    }

    getRoleInvitation(groupId: string) : Promise<DataResponse<GroupRoleInvitationResource>> {
        return axiosInterceptor.get('/api/groups/role-invitation/' + groupId)
    }

    revokeMemberPermission(memberId: string) : Promise<BaseResponse> {
        return axiosInterceptor.put('/api/groups/revoke-role/' + memberId)
    }

    deleteGroup(groupId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/groups/remove-group/' + groupId)
    }

}

export default GroupService.getInstance();