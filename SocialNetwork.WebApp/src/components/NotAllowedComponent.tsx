import { FC } from "react";
import images from "../assets";
import { Link } from "react-router-dom";
import { Button } from "antd";

const NotAllowedComponent: FC = () => {
    return <div className="w-full h-full flex items-center justify-center max-w-screen-sm mx-auto">
        <div className="flex flex-col items-center gap-y-4">
            <img className="w-[150px] h-[150px] object-cover" src={images.signal} />
            <span className="text-2xl font-bold">Bạn hiện không xem được nội dung này</span>
            <p className="text-lg text-gray-600 text-center">Lỗi này thường do chủ sở hữu chỉ chia sẻ nội dung với một nhóm nhỏ, thay đổi người được xem hoặc đã xóa nội dung.</p>
            <Link to='/'>
                <Button size="large" type="primary">Đi tới bản tin</Button>
            </Link>
        </div>
    </div>
};

export default NotAllowedComponent;
