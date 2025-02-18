import { Image } from "antd";
import { FC } from "react";
import { MessageMediaResource } from "../../../../types/message";

type MessageTwoImageProps = {
    medias: MessageMediaResource[]
}

const MessageTwoImage: FC<MessageTwoImageProps> = ({
    medias
}) => {
    return <div className="grid grid-cols-2 gap-1">
        <Image.PreviewGroup>
            <div className="overflow-hidden">
                <Image
                    preview={{
                        mask: null
                    }}
                    style={{
                        aspectRatio: 1 / 1,
                        width: '64px',
                        height: '64px',
                    }}
                    src={medias[0].mediaUrl}
                    className="object-cover aspect-square rounded-lg"
                />
            </div>
            <div className="overflow-hidden">
                <Image
                    preview={{
                        mask: null
                    }}
                    style={{
                        aspectRatio: 1 / 1,
                        width: '64px',
                        height: '64px'
                    }}
                    src={medias[1].mediaUrl}
                    className="object-cover aspect-square rounded-lg"
                />
            </div>
        </Image.PreviewGroup>
    </div>
};

export default MessageTwoImage;
