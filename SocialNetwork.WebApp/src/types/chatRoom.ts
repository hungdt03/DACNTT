import { UserResource } from "./user";

export type ChatRoomResource  = {
    id: string;
    uniqueName: string;
    name: string;
    members: UserResource[];
    imageUrl: string;
    lastMessage: string;
    lastMessageDate: Date;
    friend: UserResource | null;
    isRead: boolean;
    isOnline: boolean;
    recentOnlineTime: Date;

    // 
    isMember: boolean;
    isAdmin: boolean;
    isPrivate: boolean;
    isAccept: boolean;
    isRecipientAccepted: boolean;
}