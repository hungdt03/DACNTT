import { FC } from "react";
import MesssageOneImage from "./MesssageOneImage";
import MessageTwoImage from "./MessageTwoImage";
import MessageMoreThanTwoImage from "./MessageMoreThanTwoImage";

const MessageFromMe: FC = () => {
    return <div className="flex justify-end">
        <div className="flex items-start gap-x-2 w-[55%]">
            <div className="flex flex-col items-start gap-y-1">
                
                {/* <MesssageOneImage /> */}
                {/* <MessageTwoImage /> */}
                <MessageMoreThanTwoImage />
                <div className="bg-sky-500 text-white p-2 rounded-lg text-sm">
                    <p>thì ông bảo tui làm ảo thuật cho mn xem ông đăng nhập bằng 1 ký tự mà vào được trang đăng nhập đó</p>
                </div>

                <span className="text-xs text-gray-400 pl-1">Đã gửi vào lúc 12:23:32</span>
            </div>
        </div>
    </div>
};

export default MessageFromMe;
