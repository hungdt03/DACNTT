import { UserResource } from "./user";

export type UserScoreResource = {
    score: number;
    user: UserResource;
}