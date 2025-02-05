import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const OneImage: FC<ImageProps> = ({
    items
}) => {
    return <Image src={items[0].mediaUrl} preview={{
        mask: 'Xem'
    }} className="w-full h-full object-contain" />
};

export default OneImage;
