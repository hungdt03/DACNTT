
import axiosInterceptor from '../configurations/axiosInterceptor'
import { PositionResource } from '../types/position';
import { DataResponse } from '../types/response';


class PositionService {
    private static instance: PositionService;

    private constructor() { }

    public static getInstance(): PositionService {
        if (!PositionService.instance)
            PositionService.instance = new PositionService();
        return PositionService.instance;
    }

    searchPositions(name: string) : Promise<DataResponse<PositionResource[]>> {
        return axiosInterceptor.get('/api/positions', {
            params  : {
                name
            }
        })
    }
}

export default PositionService.getInstance();