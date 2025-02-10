import { Button, Form, FormProps, Input, message, Modal, Tabs, TabsProps } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import otpService from "../../services/otpService";
import { toast } from "react-toastify";
import OTPVerification from "../OTPVerification";
import useModal from "../../hooks/useModal";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { signIn } from "../../features/slices/auth-slice";

const AccountSettingModal: FC = () => {

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thay đổi Email',
            children: <ChangeEmailTab />,
        },
        {
            key: '2',
            label: 'Thay đổi mật khẩu',
            children: <ChangePasswordTab />,
        },

    ];
    return <div>
        <Tabs defaultActiveKey="1" items={items} />
    </div>
};

export default AccountSettingModal;

type ChangeEmailForm = {
    email: string;
    password: string;
}

const ChangeEmailTab: FC = () => {
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false)
    
    const [email, setEmail] = useState('')
    const [errorOtp, setErrorOtp] = useState('')
    const [otp, setOtp] = useState('')

    const { isModalOpen, showModal, handleCancel, handleOk } = useModal();
    const verifyOtpRef = useRef<{ startCountdown: (seconds: number) => void, clearCountdown: () => void } | null>(null);

    const dispatch = useDispatch<AppDispatch>()

    const onFinish: FormProps<ChangeEmailForm>['onFinish'] = async (values) => {
        setRequestLoading(true)
        const response = await authService.changeEmail(values.email, values.password)
        setRequestLoading(false)
        if(response.isSuccess) {
            message.success(response.message)
            showModal()
        } else {
            message.error(response.message)
        }
    };

    const handleVerifyOTP = async () => {
        setOtpLoading(true)
        const response = await otpService.verifyChangeEmail(otp, email);
        setOtpLoading(false)
        if(response.isSuccess) {
            dispatch(signIn(response.data))
            setOtp('')
            setErrorOtp('')
            message.success(response.message)
            verifyOtpRef?.current?.clearCountdown();
            handleOk();
          
        } else {
            setErrorOtp(response.message)
        }
    }

    const handleResendOTP = async () => {
        setResendLoading(true)
        console.log(email)
        const response = await otpService.resendOtpVerifyChangeEmail(email);
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

    return <>
        <Form<ChangeEmailForm>
            name="update-email"
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item<ChangeEmailForm>
                label="Địa chỉ email mới"
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ email' },
                    { type: 'email', message: 'Địa chỉ email không hợp lệ' }
                ]}
            >
                <Input onChange={(e) => {
                    setEmail(e.target.value)
                }} placeholder="Nhập địa chỉ email" />
            </Form.Item>

            <Form.Item<ChangeEmailForm>
                label="Mật khẩu xác nhận"
                name="password"
            >
                <Input.Password placeholder="Nhập mật khẩu xác nhận" />
            </Form.Item>

            <Form.Item label={null}>
                <Button loading={requestLoading} type="primary" htmlType="submit">
                    Xác nhận
                </Button>
            </Form.Item>
        </Form>

        <Modal
            style={{
                top: 20
            }}
            title={<p className="text-center font-bold text-lg">Xác thực OTP</p>}
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
    </>
}

type ChangePasswordForm = {
    oldPassword: string;
    newPassword: string;
    confirmPassowrd: string;
}

const ChangePasswordTab: FC = () => {
    const onFinish: FormProps<ChangePasswordForm>['onFinish'] = async (values) => {
        const response = await authService.changePassword(values.oldPassword, values.newPassword);
        if(response.isSuccess) {
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    };

    return <Form<ChangePasswordForm>
        name="update-email"
        onFinish={onFinish}
        layout="vertical"
    >
        <Form.Item<ChangePasswordForm>
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu cũ' },
            ]}
        >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>

        <Form.Item<ChangePasswordForm>
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            ]}
        >
            <Input.Password placeholder="Vui lòng nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item<ChangePasswordForm>
            label="Xác nhận mật khẩu"
            name="confirmPassowrd"
            dependencies={["newPassword"]}
            rules={[
                { required: true, message: "Vui lòng nhập xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                    },
                }),
            ]}

        >
            <Input.Password placeholder="Vui lòng nhập xác nhận mật khẩu" />
        </Form.Item>

        <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
                Thay đổi
            </Button>
        </Form.Item>
    </Form>
}

