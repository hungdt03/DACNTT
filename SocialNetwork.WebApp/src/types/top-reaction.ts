import { ReactionType } from "../enums/reaction"

export type TopReactionResource = {
    type: ReactionType;
    count: number;
    date: Date;
}