
import axiosInterceptor from '../configurations/axiosInterceptor'
import { CompanyResource } from '../types/company';
import { DataResponse } from '../types/response';


class CompanyService {
    private static instance: CompanyService;

    private constructor() { }

    public static getInstance(): CompanyService {
        if (!CompanyService.instance)
            CompanyService.instance = new CompanyService();
        return CompanyService.instance;
    }

    searchCompanies(name: string) : Promise<DataResponse<CompanyResource[]>> {
        return axiosInterceptor.get('/api/companies', {
            params  : {
                name
            }
        })
    }
}

export default CompanyService.getInstance();