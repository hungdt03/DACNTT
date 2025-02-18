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
    isPrivate: boolean;

    // For chatRoom has more than 2 members
    isMember: boolean;
    isAdmin: boolean;
   
    // For private chatroom
    isAccept: boolean;
    isRecipientAccepted: boolean;
    isConnect: boolean;
    isFriend: boolean;
}