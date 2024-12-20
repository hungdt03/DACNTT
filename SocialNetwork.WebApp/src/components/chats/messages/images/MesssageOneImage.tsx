import { Image } from "antd";
import { FC } from "react";
import { MessageMediaResource } from "../../../../types/message";

type MesssageOneImageProps = {
    medias: MessageMediaResource[]
}

const MesssageOneImage: FC<MesssageOneImageProps> = ({
    medias
}) => {
    return <div className="rounded-xl overflow-hidden">
        <Image width='100%' height='100%' preview={{
            mask: null
        }} src={medias[0].mediaUrl} />
    </div>
};

export default MesssageOneImage;
