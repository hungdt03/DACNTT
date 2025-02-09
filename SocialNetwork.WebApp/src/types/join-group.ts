import { UserResource } from "./user";

export type JoinGroupResource = {
    id: string;
    isApproval: boolean;
}

export type JoinGroupRequestResource = {
    id: string;
    user: UserResource;
    requestDate: Date
}