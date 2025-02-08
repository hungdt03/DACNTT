import { UserResource } from "./user"

export type SuggestedFriendResource = {
    user: UserResource;
    mutualFriends: UserResource[];
    isAdd: boolean;
}