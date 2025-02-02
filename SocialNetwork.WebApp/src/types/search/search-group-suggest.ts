import { GroupResource } from "../group"

export type SearchGroupSuggestResource = {
    group: GroupResource;
    plainText: boolean;
    isMember: boolean;
    memberFriends: number;
}