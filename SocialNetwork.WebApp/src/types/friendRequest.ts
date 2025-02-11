import { FriendRequestStatus } from "../enums/friend-request";
import { UserResource } from "./user";

export type FriendRequestResource = {
    id: string;
    sender: UserResource;
    senderId: string;
    receiverId: string;
    dateCreated: Date;
    dateUpdated: Date;
    status: FriendRequestStatus;
}

