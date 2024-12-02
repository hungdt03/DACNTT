import { Image } from "antd";
import { FC } from "react";
import { ImageProps } from "./ImageProps";

const TwoImage: FC<ImageProps> = ({
    items
}) => {
    return <div className="grid grid-cols-2 gap-2">
        {items.map((item) => <Image preview={{
            mask: 'Xem'
        }} key={item.id} src={item.mediaUrl} width='100%' height='100%' className="object-cover" />)}
    </div>
};

export default TwoImage;
