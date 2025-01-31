import { GroupPrivacy } from "../enums/group-privacy";
import { UserResource } from "./user";

export type GroupResource = {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    privacy: GroupPrivacy;
    members: UserResource[];
    isMine: boolean;
}