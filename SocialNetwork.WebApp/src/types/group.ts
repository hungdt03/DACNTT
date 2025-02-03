import { GroupPrivacy } from "../enums/group-privacy";
import { UserResource } from "./user";

export type GroupResource = {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    privacy: GroupPrivacy;
    members: UserResource[];
    isHidden: boolean;
    isMine: boolean;
    isMember: boolean;
    onlyAdminCanPost: boolean;
    requireApproval: boolean;
    requireApprovalPost: boolean;
    onlyAdminCanApprovalMember: boolean;
    
}