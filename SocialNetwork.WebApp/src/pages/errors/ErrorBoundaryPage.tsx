import { Button } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import errors from "../../assets/error";

const ErrorBoundaryPage: FC = () => {
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-y-4 text-center">
                <img className="w-[200px] h-[200px] object-cover" src={errors.error500} alt="Lỗi hệ thống" />
                <h1 className="text-3xl font-bold text-gray-800">Đã xảy ra lỗi hệ thống</h1>
                <p className="text-lg text-gray-600 max-w-md">
                    Đã có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề tiếp tục xảy ra.
                </p>
                <div className="flex items-center gap-x-4">
                    <Button size="large" type="primary" onClick={handleReload}>
                        Thử lại
                    </Button>
                    <Link to="/">
                        <Button size="large" type="default">Quay về trang chủ</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundaryPage;
