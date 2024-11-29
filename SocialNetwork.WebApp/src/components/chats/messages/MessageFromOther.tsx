import { FC } from "react";
import images from "../../../assets";
import { Avatar } from "antd";
import MessageMoreThanTwoImage from "./MessageMoreThanTwoImage";

const MessageFromOther: FC = () => {
    return <div className="flex justify-start">
        <div className="flex items-start gap-x-2 w-[55%]">
            <Avatar className="flex-shrink-0" size='small' src={images.user} />
            <div className="flex flex-col items-start gap-y-1">
                <MessageMoreThanTwoImage />
                <div className="bg-gray-200 text-gray-700 p-2 rounded-lg text-sm">
                    <p>thì ông bảo tui làm ảo thuật cho mn xem ông đăng nhập bằng 1 ký tự mà vào được trang đăng nhập đó</p>
                </div>
                <span className="text-xs text-gray-400 pl-1">Đã gửi vào lúc 12:23:32</span>
            </div>
        </div>
    </div>
};

export default MessageFromOther;
