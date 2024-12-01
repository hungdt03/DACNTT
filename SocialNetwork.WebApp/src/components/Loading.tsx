import { FC } from "react";
import { svgShared } from "../assets/svg";

const Loading: FC = () => {
    return  <div style={{
        zIndex: 10000
    }} className="bg-opacity-30 bg-black fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <img width='70px' height='70px' className="" src={svgShared.loading} />
    </div>
};

export default Loading
