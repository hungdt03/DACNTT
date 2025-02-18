import { FC } from "react";
import { svgShared } from "../assets/svg";

type LoadingProps = {
    title?: string
}

const Loading: FC<LoadingProps> = ({
    title = 'Đang tải'
}) => {
    return  <div style={{
        zIndex: 10000
    }} className="bg-opacity-30 bg-black fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center z-[5000]">
          <img width='70px' height='70px' className="" src={svgShared.loading} />
          <span className="text-lg text-white font-semibold">{title}</span>
    </div>
};

export default Loading
