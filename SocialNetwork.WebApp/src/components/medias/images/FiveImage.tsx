import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const FiveImage: FC<ImageProps> = ({
    items
}) => {
    return <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
            {items.slice(0, 3).map((item) => <Image 
                preview={{
                    mask: 'Xem',
                }} 
                key={item.id} 
                src={item.mediaUrl} 
                className="object-cover"
                width='100%'
                height='100%'
                style={{
                    aspectRatio: 1
                }}
            />)}
        </div>
        <div className="grid grid-cols-2 gap-2">
            {items.slice(3).map((item) => <Image preview={{
                mask: 'Xem',
            }} key={item.id} src={item.mediaUrl}
                className="object-cover"
                width='100%'
                height='100%' />)}
        </div>
    </div>
};

export default FiveImage;
