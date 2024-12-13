import { MediaType } from "../constants/media";
import { PrivacyType } from "../constants/privacy";
import { TagResource } from "./tag";
import { UserResource } from "./user";

export type PostResource = {
    id: string;
    content: string;
    privacy: PrivacyType;
    user: UserResource;
    createdAt: Date;
    medias: PostMediaResource[];
    comments: number;
    shares: number;
    postType: string;
    originalPostId: string;
    sharePost: PostResource;
    originalPost: PostResource;
    sharePostId: string;
    tags: TagResource[]
}

export type PostMediaResource = {
    id: string;
    mediaUrl: string;
    mediaType: MediaType
}