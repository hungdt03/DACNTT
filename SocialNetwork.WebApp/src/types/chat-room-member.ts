import { UserResource } from "./user";

export type ChatRoomMemberResource = {
    id: string;
    user: UserResource;
    isLeader: boolean;
    isAccepted: boolean;
}