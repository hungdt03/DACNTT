import { MemberRole } from "../enums/member-role";
import { GroupResource } from "./group";
import { UserResource } from "./user";

export type GroupRoleInvitationResource = {
    id: string;
    inviter: UserResource;
    invitee: UserResource;
    group: GroupResource;
    role: MemberRole
}