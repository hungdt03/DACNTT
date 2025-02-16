import { GroupResource } from "./group";
import { UserResource } from "./user";

export type GroupInvitationResource = {
    id: string;
    status: boolean;
    group: GroupResource;
    inviter: UserResource;
    invitee: UserResource;
    dateCreated: Date
}
