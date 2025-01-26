
import axiosInterceptor from '../configurations/axiosInterceptor'
import { MajorResource } from '../types/major';
import { DataResponse } from '../types/response';


class MajorService {
    private static instance: MajorService;

    private constructor() { }

    public static getInstance(): MajorService {
        if (!MajorService.instance)
            MajorService.instance = new MajorService();
        return MajorService.instance;
    }

    searchMajors(name: string) : Promise<DataResponse<MajorResource[]>> {
        return axiosInterceptor.get('/api/majors', {
            params  : {
                name
            }
        })
    }
}

export default MajorService.getInstance();