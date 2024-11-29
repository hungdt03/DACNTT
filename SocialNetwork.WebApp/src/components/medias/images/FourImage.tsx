import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const FourImage: FC<ImageProps> = ({
    items
}) => {
    return <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => <Image key={index} src={item} className="w-full h-full object-cover" />)}
    </div>
};

export default FourImage;
