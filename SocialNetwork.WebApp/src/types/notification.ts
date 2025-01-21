import { UserResource } from "./user";

export type NotificationResource = {
    id: string;
    type: string;
    title: string;
    content: string;
    imageUrl: string;
    recipient: UserResource;
    isRead: boolean;
  
    storyId: string; 
    postId: string; 
    commentId: string;
    friendRequestId: string;
  
    dateSent: Date; 
  }
  