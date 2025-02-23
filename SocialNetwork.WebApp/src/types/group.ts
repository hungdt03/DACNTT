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
    onlyAdminCanPost: boolean;
    requireApproval: boolean;
    requireApprovalPost: boolean;
    onlyAdminCanApprovalMember: boolean;
    adminCount: number;
    isDeleted: boolean;
    
    isMine: boolean;
    isMember: boolean;
    isModerator: boolean;
}

export type GroupAdminResponse = {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    privacy: string;
    countMembers: number;
    countTodayPosts: number;
    countPosts: number;
    onlyAdminCanPost: boolean;
    requireApproval: boolean;
    requireApprovalPost: boolean;
    onlyAdminCanApprovalMember: boolean;
    isHidden: boolean;
    adminCount: number;
    moderatorCount: number;
    dateCreated: Date; // Hoặc Date nếu bạn sẽ parse thành Date object trong JS
};
