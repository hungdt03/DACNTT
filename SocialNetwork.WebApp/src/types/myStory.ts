import { StoryType } from "../enums/story-type.";
import { UserResource } from "./user";
import { ViewerResource } from "./viewer";

export type MyStoryUserResource = {
    stories: MyStoryResource[]
}

export type MyStoryResource = {
    id: string;
    content: string;
    type: StoryType;
    background: string;
    fontFamily: string;
    user: UserResource;
    privacy: string;
    createdDate: Date;
    viewers: ViewerResource[]
}