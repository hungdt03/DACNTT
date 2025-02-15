import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const ThreeImage: FC<ImageProps> = ({
    items
}) => {
    return <div className="grid grid-cols-2 gap-2">
        <div className="col-span-1 h-full">
            <Image src={items[0].mediaUrl} preview={{
                mask: 'Xem'
            }} width='100%' height='100%' className="object-cover" />
        </div>

        <div className="flex flex-col gap-2">
            <Image preview={{
                mask: 'Xem'
            }} src={items[1].mediaUrl} width='100%' height='100%' style={{
                aspectRatio: 3/2
            }} className="object-cover" />
            <Image preview={{
                mask: 'Xem'
            }} src={items[2].mediaUrl} width='100%' height='100%' style={{
                aspectRatio: 3/2
            }} className="object-cover" />
        </div>
    </div>
};

export default ThreeImage;
