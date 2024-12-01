import { ReactionType } from "../constants/reaction";
import { UserResource } from "./user";

export type ReactionResource = {
    id: string;
    postId: string;
    user: UserResource;
    reactionType: ReactionType;
}