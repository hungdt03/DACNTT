import { FC } from "react";
import { svgShared } from "../assets/svg";

const LoadingIndicator: FC = () => {
    return <div className="flex flex-col items-center justify-center py-2">
        {/* <span className="animate-spin border-2 border-gray-300 border-t-transparent rounded-full w-4 h-4"></span> */}
        <img width='35px' height='35px' className="" src={svgShared.loading} />
        <span className="ml-2 text-gray-500">Đang tải...</span>
    </div>
};

export default LoadingIndicator;
