import { UserResource } from "./user";

export type JoinGroupResource = {
    isApproval: boolean;
}

export type JoinGroupRequestResource = {
    id: string;
    user: UserResource;
    requestDate: Date
}