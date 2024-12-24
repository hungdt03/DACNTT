import { MediaType } from "../constants/media";
import { UserResource } from "./user";

export type CommentResource = {
    id: string; 
    content: string;
    parentCommentId?: string | null;
    replyToUserId?: string | null;
    replyToUserName?: string | null; 
    mediaUrl?: string; 
    mediaType?: MediaType; 
    user: UserResource;
    createdAt: Date; 
    sentAt: Date; 
    isHaveChildren: boolean;
    replies: CommentResource[];
    status: string;
    level: number
};