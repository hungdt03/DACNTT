import { MajorResource } from "./major";
import { SchoolResource } from "./school";

export type UserSchoolResource = {
    id: string;
    school: SchoolResource;
    major: MajorResource;
    startYear: number;
    status: string;
}