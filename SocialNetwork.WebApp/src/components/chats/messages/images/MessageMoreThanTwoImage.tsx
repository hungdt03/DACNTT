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
                <Image width='60px' height='60px' style={{
                    overflow: 'hidden',
                    borderRadius: '6px'
                }} className="object-cover" preview={{
                    mask: null
                }} src={media.mediaUrl} />
            </div>)}

        </Image.PreviewGroup>
    </div>
};

export default MessageMoreThanTwoImage;
