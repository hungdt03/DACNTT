import { CompanyResource } from "./company";
import { PositionResource } from "./position";

export type UserWorkPlaceResource = {
    id: string;
    company: CompanyResource;
    position: PositionResource;
    startYear: number;
    isCurrent: boolean;
}