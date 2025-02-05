import { GroupResource } from "../group";
import { UserResource } from "../user";

export type SearchHistoryResource = {
    id: string;
    searchText: string;
    user: UserResource;
    group: GroupResource;
    searchAt: Date
}