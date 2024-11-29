import { Image } from "antd";
import { FC } from "react";
import images from "../../../assets";

const MesssageOneImage: FC = () => {
    return <div className="rounded-xl overflow-hidden">
        <Image width='100%' height='100%' preview={{
            mask: 'Xem'
        }} src={images.cover} />
    </div>
};

export default MesssageOneImage;
