import { OTPProps } from "antd/es/input/OTP";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { Button, Input } from "antd";

type OTPVerificationProps = {
    email: string;
    resendLoading: boolean;
    otp: string;
    otpError: string;
    onResend: () => void;
    onOtpChange: (value: string) => void
}

const OTPVerification = forwardRef(({
    otp,
    resendLoading,
    email,
    otpError,
    onOtpChange,
    onResend,
}: OTPVerificationProps, ref) => {

    const [timer, setTimer] = useState<string>("05:00");
    const [countdown, setCountdown] = useState<NodeJS.Timeout | null>(null);

    const startCountdown = (seconds: number) => {
        if (countdown) {
            clearInterval(countdown);
        }

        const interval = setInterval(() => {
            seconds -= 1;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const formattedTime = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            setTimer(formattedTime);

            if (seconds <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        console.log('setCountdown')
        setCountdown(interval);
    };

    const clearCountdown = () => {
        if (countdown) {
            clearInterval(countdown)
        }
    }

    useImperativeHandle(ref, () => ({
        startCountdown,
        clearCountdown
    }));

    useEffect(() => {
        console.log('Rerender')
        return () => clearCountdown()
    }, [])

    const onChange: OTPProps['onChange'] = (value) => {
        onOtpChange(value)
    };

    return <div className="w-full flex flex-col items-center gap-y-2 p-4">
        <div className="w-full flex flex-col items-center">
            <span>Vui lòng nhập mã OTP chúng tôi đã gửi tới</span>
            <span className="italic font-semibold">{email}</span>
        </div>

        <Input.OTP length={6}
            value={otp}
            onChange={onChange}
        />

        {otpError && <p className="text-sm text-red-600 pl-2">{otpError}</p>}

        <div className="flex justify-between">
            <p>Thời gian còn lại: {timer}</p>
        </div>

        <div className="flex items-center">
            <p>Chưa nhận được mã?</p>
            <Button loading={resendLoading} type="link" onClick={onResend}>Gửi lại</Button>
        </div>

    </div>
})

export default OTPVerification;
