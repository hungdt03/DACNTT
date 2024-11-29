import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const ThreeImage: FC<ImageProps> = ({
    items
}) => {
    return <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
            <Image src={items[0]} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-rows-2">
            <Image src={items[1]} className="w-full h-full object-cover" />
            <Image src={items[2]} className="w-full h-full object-cover" />
        </div>
    </div>
};

export default ThreeImage;
