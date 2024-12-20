import { Image } from "antd";
import { FC } from "react";
import { MessageMediaResource } from "../../../../types/message";

type MessageTwoImageProps = {
    medias: MessageMediaResource[]
}

const MessageTwoImage: FC<MessageTwoImageProps> = ({
    medias
}) => {
    return <div className="grid grid-cols-2 gap-2">
        <Image.PreviewGroup>
            <div className="rounded-xl overflow-hidden">
                <Image width='100%' height='100%' preview={{
                    mask: null
                }} src={medias[0].mediaUrl} />
            </div>
            <div className="rounded-xl overflow-hidden">
                <Image width='100%' height='100%' preview={{
                    mask: null
                }} src={medias[1].mediaUrl} />
            </div>
        </Image.PreviewGroup>
    </div>
};

export default MessageTwoImage;
