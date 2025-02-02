import { SearchGroupSuggestResource } from "./search-group-suggest";
import { SearchUserSuggestResource } from "./search-user-suggest";

export type SearchAllSuggestResource = {
    groups: SearchGroupSuggestResource[];
    users: SearchUserSuggestResource[]
}