import { FC } from "react";
import { svgShared } from "../assets/svg";

type LoadingIndicatorProps = {
    title?: string
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({
    title = 'Đang tải...'
}) => {
    return <div className="flex flex-col items-center justify-center py-2 z-[5000]">
        <img width='35px' height='35px' className="" src={svgShared.loading} />
        <span className="ml-2 text-gray-500">{title}</span>
    </div>
};

export default LoadingIndicator;
