import { PostResource } from "./post";
import { UserResource } from "./user";

export type SavedPostResource = {
    id: string;
    post: PostResource;
    user: UserResource
}