import { GroupPrivacy } from "../enums/group-privacy";
import { UserResource } from "./user";

export type GroupResource = {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    privacy: GroupPrivacy;
    dateCreated: Date,
    members: UserResource[];
    friendMembers: UserResource[];
    countMembers: number;
    countTodayPosts: number;
    isHidden: boolean;
    isMine: boolean;
    isMember: boolean;
    onlyAdminCanPost: boolean;
    requireApproval: boolean;
    requireApprovalPost: boolean;
    onlyAdminCanApprovalMember: boolean;
    adminCount: number;
    isDeleted: boolean;
    
}