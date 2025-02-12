import { Button } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import images from "../../assets";

const AccessDeniedPage: FC = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-y-4 text-center">
                <img className="w-[200px] h-[200px] object-cover" src={images.signal} alt="Access Denied" />
                <h1 className="text-3xl font-bold text-gray-800">Truy cập bị từ chối</h1>
                <p className="text-lg text-gray-600 max-w-md">
                    Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại tài khoản hoặc liên hệ quản trị viên để biết thêm chi tiết.
                </p>
                <Link to="/">
                    <Button size="large" type="primary">Đi tới bản tin</Button>
                </Link>
            </div>
        </div>
    );
};

export default AccessDeniedPage;
