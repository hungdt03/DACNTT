
import axiosInterceptor from '../configurations/axiosInterceptor'
import { SignInRequest } from '../pages/auth/SignInPage';
import { SignUpRequest } from '../pages/auth/SignUpPage';
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

    forgotPassword(email: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/auth/forgot-password', { email })
    }

    resetPassword(email: string, resetPasswordToken: string, newPassword: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/auth/reset-password', { email, resetPasswordToken, newPassword })
    }
}

export default AuthService.getInstance();