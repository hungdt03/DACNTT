import { ReactionType } from "../enums/reaction";
import { UserResource } from "./user";

export type ReactionResource = {
    id: string;
    postId: string;
    user: UserResource;
    reactionType: ReactionType;
}