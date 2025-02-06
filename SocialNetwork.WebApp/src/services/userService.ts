
import { ModifyEducationRequest } from '../components/modals/ModifyUserEducation';
import { ModifyUserHometownRequest } from '../components/modals/ModifyUserHometown';
import { ModifyUserLocationRequest } from '../components/modals/ModifyUserLocation';
import { ModifyUserWorkPlaceRequest } from '../components/modals/ModifyUserWorkPlace';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { LocationResource } from '../types/location';
import { BaseResponse, DataResponse, PaginationResponse } from '../types/response';
import { UserResource } from '../types/user';
import { UserSchoolResource } from '../types/userSchool';
import { UserWorkPlaceResource } from '../types/userWorkPlace';

class UserService {
    private static instance: UserService;

    private constructor() { }

    public static getInstance(): UserService {
        if (!UserService.instance)
            UserService.instance = new UserService();
        return UserService.instance;
    }

    getUserById(userId: string) : Promise<DataResponse<UserResource>> {
        return axiosInterceptor.get('/api/users/' + userId)
    }

    uploadAvatar(formData: FormData) : Promise<DataResponse<UserResource>> {
        return axiosInterceptor.put('/api/users/avatar', formData);
    }

    uploadCoverImage(formData: FormData) : Promise<DataResponse<UserResource>> {
        return axiosInterceptor.put('/api/users/coverImage', formData);
    }

    modifyBio(bio: string) : Promise<DataResponse<string>> {
        return axiosInterceptor.post('/api/users/modify-bio', { bio })
    }

    // Education

    addUserEducation(payload: ModifyEducationRequest) : Promise<DataResponse<string>> {
        return axiosInterceptor.post('/api/users/education', payload)
    }

    updateUserEducation(userSchoolId: string, payload: ModifyEducationRequest) : Promise<DataResponse<string>> {
        return axiosInterceptor.put('/api/users/education/' + userSchoolId, payload)
    }

    deleteUserEducation(userSchoolId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/users/education/' + userSchoolId);
    }

    getUserEducation() : Promise<DataResponse<UserSchoolResource[]>> {
        return axiosInterceptor.get('/api/users/education')
    }

    getUserEducationByUserId(userId: string) : Promise<DataResponse<UserSchoolResource[]>> {
        return axiosInterceptor.get('/api/users/education/' + userId)
    }

     // Work place

     addUserWorkPlace(payload: ModifyUserWorkPlaceRequest) : Promise<DataResponse<string>> {
        return axiosInterceptor.post('/api/users/workPlace', payload)
    }

    updateUserWorkPlace(userSchoolId: string, payload: ModifyUserWorkPlaceRequest) : Promise<DataResponse<string>> {
        return axiosInterceptor.put('/api/users/workPlace/' + userSchoolId, payload)
    }

    deleteUserWorkPlace(userWorkPlaceId: string) : Promise<BaseResponse> {
        return axiosInterceptor.delete('/api/users/workPlace/' + userWorkPlaceId);
    }

    getUserWorkPlace() : Promise<DataResponse<UserWorkPlaceResource[]>> {
        return axiosInterceptor.get('/api/users/workPlace')
    }

    getUserWorkPlaceByUserId(userId: string) : Promise<DataResponse<UserWorkPlaceResource[]>> {
        return axiosInterceptor.get('/api/users/workPlace/' + userId)
    }


    // Location
    getUserLocation () : Promise<DataResponse<LocationResource>> {
        return axiosInterceptor.get('/api/users/location')
    }

    getUserLocationByUserId (userId: string) : Promise<DataResponse<LocationResource>> {
        return axiosInterceptor.get('/api/users/location/' + userId)
    }

    modifyUserLocation(payload: ModifyUserLocationRequest) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/users/location', payload)
    }

    // Hometown
    getUserHometown () : Promise<DataResponse<LocationResource>> {
        return axiosInterceptor.get('/api/users/hometown')
    }

    getUserHometownByUserId (userId: string) : Promise<DataResponse<LocationResource>> {
        return axiosInterceptor.get('/api/users/hometown/' + userId)
    }


    modifyUserHometown(payload: ModifyUserHometownRequest) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/users/hometown', payload)
    }

    getAllBlockUsers(page: number, size: number) : Promise<PaginationResponse<UserResource[]>> {
        return axiosInterceptor.get('/api/users/blocks', {
            params: {
                page,
                size
            }
        })
    }
}

export default UserService.getInstance();