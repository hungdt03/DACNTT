import { Image } from "antd";
import { FC } from "react";
import { MessageMediaResource } from "../../../../types/message";

type MessageMoreThanTwoImageProps = {
    medias: MessageMediaResource[]
}

const MessageMoreThanTwoImage: FC<MessageMoreThanTwoImageProps> = ({
    medias
}) => {
    return <div className="grid grid-cols-3 gap-1">
        <Image.PreviewGroup>
            {medias.map(media => <div key={media.id} className="overflow-hidden">
                <Image
                    preview={{
                        mask: null
                    }}
                    style={{
                        aspectRatio: 1,
                        width: '54px',
                        height: '54px',
                    }}
                    src={medias[0].mediaUrl}
                    className="object-cover aspect-square rounded-lg"
                />
            </div>)}

        </Image.PreviewGroup>
    </div>
};

export default MessageMoreThanTwoImage;
