import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const FourImage: FC<ImageProps> = ({
    items
}) => {
    return <div className="grid grid-cols-2 gap-2">
        {items.map((item) => <Image preview={{
            mask: 'Xem'
        }} key={item.id} src={item.mediaUrl} width='100%' height='300px' className="object-cover" />)}
    </div>
};

export default FourImage;
