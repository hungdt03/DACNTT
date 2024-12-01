import { UserResource } from "./user";

export type CommentResource = {
    id: string; 
    content: string;
    parentCommentId?: string | null;
    replyToUserId?: string | null;
    replyToUserName?: string | null; 
    mediaUrl?: string | null; 
    user: UserResource;
    createdAt: Date; 
    isHaveChildren: boolean;
    replies: CommentResource[]
};