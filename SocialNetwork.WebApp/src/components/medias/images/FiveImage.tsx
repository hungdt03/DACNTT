import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const FiveImage: FC<ImageProps> = ({
    items
}) => {
    return <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
            {items.slice(0, 3).map((item, index) => <Image key={index} src={item} className="w-full h-full object-cover" />)}
        </div>
        <div className="grid grid-cols-2 gap-2">
            {items.slice(3).map((item, index) => <Image key={index} src={item} className="w-full h-full object-cover" />)}
        </div>
    </div>
};

export default FiveImage;
