import { FC } from "react";

const LoadingIndicator: FC = () => {
    return <div className="flex items-center justify-center py-2">
        <span className="animate-spin border-2 border-gray-300 border-t-transparent rounded-full w-4 h-4"></span>
        <span className="ml-2 text-gray-500">Đang tải...</span>
    </div>
};

export default LoadingIndicator;
