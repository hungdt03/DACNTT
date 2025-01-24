
import { EducationFormRequest } from '../components/modals/ModifyUserEducation';
import axiosInterceptor from '../configurations/axiosInterceptor'
import { BaseResponse, DataResponse } from '../types/response';
import { UserResource } from '../types/user';
import { UserSchoolResource } from '../types/userSchool';


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

    modifyUserEducation(payload: EducationFormRequest) : Promise<DataResponse<string>> {
        return axiosInterceptor.post('/api/users/modify-education', payload)
    }

    getUserEducation() : Promise<DataResponse<UserSchoolResource[]>> {
        return axiosInterceptor.get('/api/users/education')
    }
}

export default UserService.getInstance();