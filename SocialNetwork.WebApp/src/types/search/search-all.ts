import { PostResource } from "../post";
import { SearchGroupSuggestResource } from "./search-group-suggest";
import { SearchUserSuggestResource } from "./search-user-suggest";

export type SearchAllResource = {
    groups: SearchGroupSuggestResource[];
    users: SearchUserSuggestResource[];
    posts: PostResource[]
}
