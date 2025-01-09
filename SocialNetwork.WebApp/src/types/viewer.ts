import { UserResource } from "./user"

export type ViewerResource = {
    user: UserResource;
    reactions: string[]
}