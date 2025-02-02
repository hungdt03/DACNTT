import { GroupResource } from "../group"
import { UserResource } from "../user";

export type SearchGroupSuggestResource = {
    group: GroupResource;
    plainText: boolean;
    isMember: boolean;
    countFriendMembers: number;
    totalMembers: number;
    friendMembers: UserResource[]
}