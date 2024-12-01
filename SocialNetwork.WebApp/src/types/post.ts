import { MediaType } from "../constants/media";
import { PrivacyType } from "../constants/privacy";
import { UserResource } from "./user";

export type PostResource = {
    id: string;
    content: string;
    privacy: PrivacyType;
    user: UserResource;
    createdAt: Date;
    medias: PostMediaResource[];
    comments: number;
}

export type PostMediaResource = {
    id: string;
    mediaUrl: string;
    mediaType: MediaType
}