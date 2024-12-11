import { UserResource } from "./user";

export interface FriendResource extends UserResource {
    mutualFriends: number;
}