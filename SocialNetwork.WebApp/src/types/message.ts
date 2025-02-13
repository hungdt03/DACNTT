import { MediaType } from "../enums/media";
import { UserResource } from "./user";

export type MessageResource = {
    id: string;
    sender: UserResource;
    senderId: string;
    content: string;
    medias: MessageMediaResource[]
    sentAt: Date;
    chatRoomId: string;
    status: string;
    reads?: ReadStatusResource[];

    type?: "REMOVE" | "ADD" ;
    memberId?: string;
}

export type ReadStatusResource = {
    user: UserResource;
    readAt: Date;
    userId: string;
}


export type MessageMediaResource = {
    id: string;
    mediaUrl: string;
    mediaType: MediaType
}