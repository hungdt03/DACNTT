import { MediaType } from "../enums/media";
import { PrivacyType } from "../enums/privacy";
import { GroupResource } from "./group";
import { TagResource } from "./tag";
import { UserResource } from "./user";

export type PostResource = {
    id: string;
    content: string;
    background: string;
    isGroupPost: boolean;
    privacy: PrivacyType;
    user: UserResource;
    createdAt: Date;
    medias: PostMediaResource[];
    comments: number;
    shares: number;
    reactions: number;
    postType: string;
    originalPostId: string;
    sharePost: PostResource;
    originalPost: PostResource;
    sharePostId: string;
    group: GroupResource
    tags: TagResource[];
    isSaved: boolean;
}

export type PostMediaResource = {
    id: string;
    mediaUrl: string;
    mediaType: MediaType
}