import { FriendRequestResource } from "./friendRequest";
import { UserResource } from "./user";

export type NotificationResource = {
    id: string;
    type: string;
    title: string;
    content: string;
    imageUrl: string;
    recipient: UserResource;
    isRead: boolean;
  
    groupId: string; 
    groupInvitationId: string; 
    storyId: string; 
    postId: string; 
    commentId: string;
    friendRequestId: string;
    friendRequest: FriendRequestResource
  
    dateSent: Date; 
  }
  