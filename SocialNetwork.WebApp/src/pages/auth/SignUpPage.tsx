import { FC, useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from 'formik';
import { Link, useNavigate } from "react-router-dom";

import images from "../../assets";
import authService from "../../services/authService";
import { toast } from "react-toastify";
import signUpSchema from "../../schemas/signUpSchema";
import {Modal } from "antd";
import useModal from "../../hooks/useModal";
import otpService from "../../services/otpService";
import OTPVerification from "../../components/OTPVerification";
import useTitle from "../../hooks/useTitle";
import Loading from "../../components/Loading";

export type SignUpRequest = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
}


const SignUpPage: FC = () => {
    useTitle('Đăng kí')
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const { isModalOpen, showModal, handleCancel, handleOk } = useModal();

    const [otp, setOtp] = useState('')
    const [errorOtp, setErrorOtp] = useState('')
    const [email, setEmail] = useState('')
    const verifyOtpRef = useRef<{ startCountdown: (seconds: number) => void, clearCountdown: () => void } | null>(null);


    const handleSignUpAsync = async (values: SignUpRequest) => {
        setLoading(true)
        const response = await authService.signUp(values);
        setLoading(false)
        if (response.isSuccess) {
            toast.success(response.message)
            showModal();
        } else {
            toast.error(response.message)
        }
    }

    const handleVerifyOTP = async () => {
        setOtpLoading(true)
        const response = await otpService.verifyAccount(otp, email);
        setOtpLoading(false)

        if (response.isSuccess) {
            toast.success(response.message)
            setOtp('')
            setErrorOtp('')
            verifyOtpRef?.current?.clearCountdown();
            handleOk();
            navigate('/sign-in')
        } else {
            setErrorOtp(response.message)
        }

        return response;

    }

    const handleResendOTP = async () => {
        setResendLoading(true)
        const response = await otpService.resendOtpVerifyAccount(email);
        setResendLoading(false)
        if (response.isSuccess) {
            toast.success(response.message)
            verifyOtpRef.current?.startCountdown(5 * 60);
        } else {
            toast.error(response.message)
        }
    }

    useEffect(() => {
        if (isModalOpen && verifyOtpRef.current) {
            verifyOtpRef.current.startCountdown(5 * 60)
        }
    }, [isModalOpen])

    return <div className="flex flex-col gap-y-6 justify-center h-full p-8">
        {loading && <Loading title="Đang xử lí" />}
        <div className="flex flex-col items-center md:items-start gap-y-4 md:gap-y-0">
            <img src={images.facebook} className="w-[40px] h-[40px] md:hidden" />
            <span className="font-bold text-2xl text-left text-sky-600">ĐĂNG KÍ TÀI KHOẢN</span>
        </div>
        <Formik<SignUpRequest>
            initialValues={{
                email: '',
                fullName: '',
                password: '',
                confirmPassword: '',
                role: 'USER'
            }}
            onSubmit={handleSignUpAsync}
            validationSchema={signUpSchema}
        >
            {({ errors, touched, handleChange }) => (
                <Form className="flex flex-col gap-y-4 w-full">
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="fullName" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Họ và tên
                        </label>
                        <Field name="fullName" id='fullName' placeholder="Họ và tên" className='border-[1px] outline-none px-6 py-2 rounded-lg border-primary' />
                        {errors.fullName && touched.fullName && <div className="text-sm pl-3 text-red-500">{errors.fullName}</div>}
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="email" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Email
                        </label>
                        <Field onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setEmail(e.target.value);
                        }} name="email" id='email' placeholder="Địa chỉ email" className='border-[1px] outline-none px-6 py-2 rounded-lg border-primary' />
                        {errors.email && touched.email && <div className="text-sm pl-3 text-red-500">{errors.email}</div>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="password" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Mật khẩu
                        </label>
                        <Field name="password" id='password' type='password' placeholder='Mật khẩu' className='border-[1px] outline-none px-6 py-2 rounded-lg border-primary' />
                        {errors.password && touched.password && <div className="text-sm pl-3 text-red-500">{errors.password}</div>}

                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="confirmPassword" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Nhập lại mật khẩu
                        </label>
                        <Field name="confirmPassword" id='confirmPassword' type='password' placeholder='Xác nhận mật khẩu' className='border-[1px] outline-none px-6 py-2 rounded-lg border-primary' />
                        {errors.confirmPassword && touched.confirmPassword && <div className="text-sm pl-3 text-red-500">{errors.confirmPassword}</div>}

                    </div>
                    <button disabled={loading} className="mt-3 px-6 py-2 text-white rounded-lg bg-sky-600">Đăng kí</button>
                    <div className="flex items-center gap-x-2 justify-center">
                        <span className="text-gray-500 text-sm">Đã có tài khoản?</span>
                        <Link className="text-sky-600 font-bold text-sm hover:underline" to='/sign-in'>Đăng nhập</Link>
                    </div>
                </Form>
            )}
        </Formik>

        <Modal
            style={{
                top: 20
            }}
            title={<p className="text-center font-semibold text-xl">Xác thực tài khoản</p>}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            maskClosable={false}
            okText='Xác thực'
            cancelText='Hủy bỏ'
            okButtonProps={{
                disabled: otp.length !== 6,
                loading: otpLoading,
                onClick: () => verifyOtpRef.current && void handleVerifyOTP()
            }}
        >
            {email && <OTPVerification
                otp={otp}
                otpError={errorOtp}
                onOtpChange={(value) => setOtp(value)}
                ref={verifyOtpRef}
                email={email}
                resendLoading={resendLoading}
                onResend={handleResendOTP}

            />}
        </Modal>
    </div>
};

export default SignUpPage;
