import { UserResource } from "./user";

export type ChatRoomResource  = {
    id: string;
    uniqueName: string;
    name: string;
    members: UserResource[];
    imageUrl: string;
    isMember: boolean;
    isLeader: boolean;
    lastMessage: string;
    lastMessageDate: Date;
    isPrivate: boolean;
    friend: UserResource | null;
    isRead: boolean;
    isOnline: boolean;
    recentOnlineTime: Date;
    isAccept: boolean;
    isRecipientAccepted: boolean;
}