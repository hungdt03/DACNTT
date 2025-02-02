import { GroupResource } from "../group"
import { PostResource } from "../post";
import { UserResource } from "../user";

export type SearchAllResource = {
    groups: GroupResource[];
    users: UserResource[];
    posts: PostResource[]
}
