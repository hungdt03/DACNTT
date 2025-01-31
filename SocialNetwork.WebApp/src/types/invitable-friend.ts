import { FriendResource } from "./friend"

export type InvitableFriendResource = {
    friend: FriendResource;
    isMember: boolean;
    haveInvited: boolean;
}