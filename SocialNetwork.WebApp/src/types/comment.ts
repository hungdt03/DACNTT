import { MediaType } from "../enums/media";
import { CommentMentionPagination } from "../utils/pagination";
import { BaseResponse } from "./response";
import { UserResource } from "./user";

export type CommentResource = {
    id: string; 
    content: string;
    postId: string;
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
    level: number;
    pagination?: CommentMentionPagination
};

export interface CommentMentionPaginationResource extends BaseResponse {
    data: CommentResource[];
    pagination: CommentMentionPagination
}