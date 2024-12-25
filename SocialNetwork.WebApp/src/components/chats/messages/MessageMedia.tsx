import { FC } from "react";
import { MessageMediaResource } from "../../../types/message";
import { MediaType } from "../../../enums/media";
import MessageIncludeVideo from "./medias/MessageIncludeVideo";
import MessageIncludeImage from "./images/MessageIncludeImage";

type MessageMediaProps = {
    medias: MessageMediaResource[]
}

const MessageMedia: FC<MessageMediaProps> = ({
    medias
}) => {
    if(medias.some(item => item.mediaType === MediaType.VIDEO)) {
        return <MessageIncludeVideo medias={medias} />
    }

    return <MessageIncludeImage medias={medias} />
};

export default MessageMedia;
