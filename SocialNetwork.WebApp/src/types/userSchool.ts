import { SchoolResource } from "./school";

export type UserSchoolResource = {
    id: string;
    school: SchoolResource;
    startDate: Date;
    status: string;
}