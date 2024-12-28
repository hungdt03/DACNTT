import { StoryType } from "../enums/story-type.";
import { UserResource } from "./user";

export type StoryResource = {
    id: string;
    content: string;
    type: StoryType;
    background: string;
    fontFamily: string;
    user: UserResource;
    privacy: string;
    createdDate: Date;
}

