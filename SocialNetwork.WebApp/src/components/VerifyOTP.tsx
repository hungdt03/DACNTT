import { Button } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import OTPInput from "react-otp-input";
import { BaseResponse } from "../types/response";

type VerifyOTPProps = {
    onSubmit: (otp: string) => Promise<BaseResponse>;
    loading: boolean
}

const VerifyOTP = forwardRef(({
    onSubmit,
    loading
}: VerifyOTPProps, ref) => {
    const [otp, setOtp] = useState<string>('')
    const [error, setError] = useState<string>('');

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

    
    const handleSendOtp = async () => {
        const response = await onSubmit(otp);
        if(!response.isSuccess) {
            setError(response.message)
        } else {
            setError('')
            if(countdown) {
                clearInterval(countdown)
            }
        }
    }

    useImperativeHandle(ref, () => ({
        startCountdown
    }));

    useEffect(() => {
        return () => {
            if(countdown) {
                clearInterval(countdown)
            }
        }
    }, [])

    return <div className="w-full flex flex-col items-center gap-y-3 p-4">
        <OTPInput
            skipDefaultStyles
            inputStyle='w-12 text-center py-2 border-[1px] border-black outline-black rounded-sm text-black text-lg'
            value={otp}
            containerStyle='flex items-center justify-center animate-shake'
            onChange={setOtp}
            renderSeparator={<span className="w-2"></span>}
            numInputs={6}
            shouldAutoFocus
            renderInput={(props) => <input {...props} />}
        />

        {error && <p className="text-sm text-red-600 pl-2">{error}</p>}

        <div className="flex justify-end">
            <Button loading={loading} disabled={otp.length !== 6} onClick={handleSendOtp} type="primary" >Xác thực</Button>
        </div>

        <div className="flex justify-between">
            <p>Thời gian còn lại: {timer}</p>
        </div>

        <div className="flex items-center gap-x-1">
            <span>Vui lòng nhập mã OTP chúng tôi đã gửi tới</span>
            <span className="font-semibold italic">hungktpm1406@gmail.com</span>
        </div>
    </div>
})

export default VerifyOTP;
