
import axiosInterceptor from '../configurations/axiosInterceptor'
import { DataResponse } from '../types/response';
import { SchoolResource } from '../types/school';


class SchoolService {
    private static instance: SchoolService;

    private constructor() { }

    public static getInstance(): SchoolService {
        if (!SchoolService.instance)
            SchoolService.instance = new SchoolService();
        return SchoolService.instance;
    }

    searchSchool(name: string) : Promise<DataResponse<SchoolResource[]>> {
        return axiosInterceptor.get('/api/schools', {
            params  : {
                name
            }
        })
    }
}

export default SchoolService.getInstance();