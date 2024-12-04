import { MediaType } from "../constants/media";
import { UserResource } from "./user";

export type CommentResource = {
    id: string; 
    content: string;
    parentCommentId?: string | null;
    replyToUserId?: string | null;
    replyToUserName?: string | null; 
    mediaUrl?: string | null; 
    mediaType?: MediaType; 
    user: UserResource;
    createdAt: Date; 
    isHaveChildren: boolean;
    replies: CommentResource[]
};