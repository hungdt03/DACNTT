
import axiosInterceptor from '../configurations/axiosInterceptor'
import { AuthResponse, BaseResponse, DataResponse } from '../types/response';


class OtpService {
    private static instance: OtpService;

    private constructor() { }

    public static getInstance(): OtpService {
        if (!OtpService.instance)
            OtpService.instance = new OtpService();
        return OtpService.instance;
    }

    verifyAccount(otpCode: string, email: string) : Promise<BaseResponse> {
        return axiosInterceptor.post('/api/otps/verify-account', {
            otpCode,
            email
        })
    }

    verifyForgotPassword(otpCode: string, email: string) : Promise<DataResponse<string>> {
        return axiosInterceptor.post('/api/otps/verify-forgot-password', {
            otpCode,
            email
        })
    }

    resendOtpVerifyAccount(email: string) :Promise<BaseResponse> {
        return axiosInterceptor.post('/api/otps/resend-verify-account', {
            email
        })
    }

    resendOtpVerifyForgotPassword(email: string) :Promise<BaseResponse> {
        return axiosInterceptor.post('/api/otps/resend-verify-forgot-password', {
            email
        })
    }

    
    verifyChangeEmail(otpCode: string, email: string) : Promise<DataResponse<AuthResponse>> {
        return axiosInterceptor.post('/api/otps/verify-change-email', {
            otpCode,
            email
        })
    }

    resendOtpVerifyChangeEmail(email: string) :Promise<BaseResponse> {
        return axiosInterceptor.post('/api/otps/resend-change-email', {
            email
        })
    }

}

export default OtpService.getInstance();