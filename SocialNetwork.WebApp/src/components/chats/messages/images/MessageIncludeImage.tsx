import { FC } from "react";
import { MessageMediaResource } from "../../../../types/message";
import MesssageOneImage from "./MesssageOneImage";
import MessageTwoImage from "./MessageTwoImage";
import MessageMoreThanTwoImage from "./MessageMoreThanTwoImage";

type MessageIncludeImageProps = {
    medias: MessageMediaResource[]
}

const MessageIncludeImage: FC<MessageIncludeImageProps> = ({
    medias
}) => {
    if (medias.length === 1) return <MesssageOneImage medias={medias} />

    if (medias.length === 2) return <MessageTwoImage medias={medias} />

    if (medias.length > 2) return <MessageMoreThanTwoImage medias={medias} />
};

export default MessageIncludeImage;
