import { UserResource } from "../user"

export type SearchUserSuggestResource = {
    user: UserResource;
    isFriend: boolean;
    mutualFriends: number;
    plainText: boolean;
}