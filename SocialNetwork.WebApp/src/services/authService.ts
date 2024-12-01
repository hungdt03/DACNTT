
import axiosInterceptor from '../configurations/axiosInterceptor'
import { SignInRequest } from '../pages/SignInPage';
import { SignUpRequest } from '../pages/SignUpPage';
import { AuthResponse, BaseResponse, DataResponse } from '../types/response';
import { UserResource } from '../types/user';


class AuthService {
    private static instance: AuthService;

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance)
            AuthService.instance = new AuthService();
        return AuthService.instance;
    }


    signUp(payload: SignUpRequest): Promise<BaseResponse> {
        return axiosInterceptor.post('/api/auth/sign-up', payload)
    }

    signIn(payload: SignInRequest): Promise<DataResponse<AuthResponse>> {
        return axiosInterceptor.post('/api/auth/sign-in', payload)
    }

    getPrincipal() : Promise<DataResponse<UserResource>> {
        return axiosInterceptor.get('/api/auth/principal')
    }
}

export default AuthService.getInstance();