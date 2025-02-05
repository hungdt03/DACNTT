import { UserResource } from "./user";

export type GroupMemberResource = {
    id: string;
    user: UserResource;
    role: string;
    joinDate: Date;
    isInvitedAsAdmin: boolean;
    isInvitedAsModerator: boolean;
};