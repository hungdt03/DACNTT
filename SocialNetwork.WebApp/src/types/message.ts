import { MediaType } from "../enums/media";
import { MessageType } from "../enums/message-type";
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
    messageType?: MessageType

    isRemove?: boolean;
    memberId?: string;

    isFetch?: boolean;
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