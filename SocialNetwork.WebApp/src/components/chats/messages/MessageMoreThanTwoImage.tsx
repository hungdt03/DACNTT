import { Image } from "antd";
import { FC } from "react";
import images from "../../../assets";

const MessageMoreThanTwoImage: FC = () => {
    return <div className="grid grid-cols-3 gap-2">
        <Image.PreviewGroup>
            <div className="rounded-xl overflow-hidden">
                <Image width='100%' height='100%' preview={{
                    mask: 'Xem'
                }} src={images.cover} />
            </div>
            <div className="rounded-xl overflow-hidden">
                <Image width='100%' height='100%' preview={{
                    mask: 'Xem'
                }} src={images.cover} />
            </div>
            <div className="rounded-xl overflow-hidden">
                <Image width='100%' height='100%' preview={{
                    mask: 'Xem'
                }} src={images.cover} />
            </div>
            <div className="rounded-xl overflow-hidden">
                <Image width='100%' height='100%' preview={{
                    mask: 'Xem'
                }} src={images.cover} />
            </div>
            <div className="rounded-xl overflow-hidden">
                <Image width='100%' height='100%' preview={{
                    mask: 'Xem'
                }} src={images.cover} />
            </div>
        </Image.PreviewGroup>
    </div>
};

export default MessageMoreThanTwoImage;
