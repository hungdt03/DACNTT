
import axiosInterceptor from '../configurations/axiosInterceptor'
import { LocationResource } from '../types/location';
import { DataResponse } from '../types/response';

class LocationService {
    private static instance: LocationService;

    private constructor() { }

    public static getInstance(): LocationService {
        if (!LocationService.instance)
            LocationService.instance = new LocationService();
        return LocationService.instance;
    }

    searchLocations(address: string) : Promise<DataResponse<LocationResource[]>> {
        return axiosInterceptor.get('/api/locations', {
            params  : {
                name: address
            }
        })
    }
}

export default LocationService.getInstance();