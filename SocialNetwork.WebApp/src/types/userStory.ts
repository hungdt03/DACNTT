import { StoryResource } from "./story";
import { UserResource } from "./user"

export type UserStoryResource = {
    user: UserResource;
    stories: StoryResource[];
    haveSeen: boolean;
}