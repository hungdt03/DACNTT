import { FC, useEffect, useRef, useState } from "react";
import images from "../../assets";
import cn from "../../utils/cn";
import { Link, useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { Button, Modal } from "antd";
import useModal from "../../hooks/useModal";
import authService from "../../services/authService";
import { toast } from "react-toastify";
import ResetPassword from "../../components/ResetPassword";
import { Field, Form, Formik } from "formik";
import forgotPasswordSchema from "../../schemas/forgotPasswordSchema";
import otpService from "../../services/otpService";
import OTPVerification from "../../components/OTPVerification";
import useTitle from "../../hooks/useTitle";

export type ForgotPasswordFormik = {
    email: string;
}

const ForgotPasswordPage: FC = () => {
    useTitle('Quên mật khẩu')
    const { isModalOpen, showModal, handleCancel, handleOk } = useModal();

    const [mailLoading, setMailLoading] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [errorOtp, setErrorOtp] = useState('')
    const [otp, setOtp] = useState('')
    const [verifyOtp, setVerifyOtp] = useState(false);
    const [resetPasswordToken, setResetPasswordToken] = useState('');

    const navigate = useNavigate();
    const verifyOtpRef = useRef<{ startCountdown: (seconds: number) => void, clearCountdown: () => void } | null>(null);

    const handleSendEmail = async (values: ForgotPasswordFormik) => {
        setEmail(values.email)
        setMailLoading(true)
        const response = await authService.forgotPassword(values.email);
        setMailLoading(false)
        if (response.isSuccess) {
            toast.success(response.message)
            showModal()
        } else {
            toast.error(response.message)
        }
    }

    const handleVerifyOTP = async () => {
        setOtpLoading(true)
        const response = await otpService.verifyForgotPassword(otp, email);
        setOtpLoading(false)
        if (response.isSuccess) {
            setOtp('')
            setErrorOtp('')
            setVerifyOtp(true)
            verifyOtpRef?.current?.clearCountdown();
            setResetPasswordToken(response.data)
        } else {
            setErrorOtp(response.message)
        }
    }

    const handleResetPassword = async (password: string) => {
        const response = await authService.resetPassword(email, resetPasswordToken, password);
        if (response.isSuccess) {
            toast.success(response.message)
            handleOk();
            navigate('/sign-in')
        } else {
            toast.error(response.message)
        }
    }

    const handleResendOTP = async () => {
        setResendLoading(true)
        const response = await otpService.resendOtpVerifyForgotPassword(email);
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
            verifyOtpRef.current.startCountdown(5 * 60);
        }
    }, [isModalOpen])

    return <>
        <div className="flex flex-col gap-y-6 justify-center h-full px-8 py-36">
            <div className="flex flex-col items-center md:items-start gap-y-4 md:gap-y-0">
                <img src={images.facebook} className="w-[40px] h-[40px] md:hidden" />
                <span className="font-bold text-2xl text-left text-sky-600">QUÊN MẬT KHẨU</span>
            </div>

            <div className="flex flex-col gap-y-1 w-full">
                <Formik<ForgotPasswordFormik>
                    initialValues={{
                        email: ''
                    }}
                    onSubmit={handleSendEmail}
                    validationSchema={forgotPasswordSchema}
                >
                    {({ errors, touched }) => (
                        <Form className="w-full flex flex-col gap-y-4">

                            <div className="flex flex-col gap-y-1">
                                <label htmlFor="email" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                                    Email
                                </label>
                                <Field name="email" id='email' placeholder="Địa chỉ email" className={cn('border-[1px] outline-none px-6 py-2 rounded-lg transition-all ease-linear duration-150', (errors.email && touched.email) ? 'border-red-500' : 'border-primary')} />
                                {errors.email && touched.email && <div className="text-sm pl-3 text-red-500">{errors.email}</div>}
                            </div>
                            <div className="flex justify-end">
                                <Button loading={mailLoading} htmlType="submit" type="primary" size="large">Gửi</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <Link to='/sign-in' className="text-primary text-sm flex items-center gap-x-1">
                    <MoveLeft />
                    Quay lại đăng nhập
                </Link>
            </div>
        </div>

        <Modal
            style={{
                top: 20
            }}
            title={<p className="text-center font-bold text-lg">Khôi phục mật khẩu</p>}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            maskClosable={false}
            classNames={{
                footer: verifyOtp ? 'hidden' : ''
            }}
            okText='Xác thực'
            cancelText='Hủy bỏ'
            okButtonProps={{
                disabled: otp.length !== 6,
                loading: otpLoading,
                onClick: () => verifyOtpRef.current && void handleVerifyOTP()
            }}
        >
            {!verifyOtp ? <OTPVerification
                otp={otp}
                otpError={errorOtp}
                onOtpChange={(value) => setOtp(value)}
                ref={verifyOtpRef}
                email={email}
                resendLoading={resendLoading}
                onResend={handleResendOTP}
            /> :
                <ResetPassword loading={false} onSubmit={handleResetPassword} />
            }
        </Modal>
    </>
};

export default ForgotPasswordPage;
