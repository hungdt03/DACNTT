import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const OneImage: FC<ImageProps> = ({
    items
}) => {
    return <Image src={items[0]} className="w-full h-full object-cover" />
};

export default OneImage;
