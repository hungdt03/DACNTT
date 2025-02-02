import { FriendResource } from "../friend";
import { UserResource } from "../user"

export type SearchUserSuggestResource = {
    user: UserResource;
    isFriend: boolean;
    countMutualFriends: number;
    plainText: boolean;
    mutualFriends: FriendResource[]
}