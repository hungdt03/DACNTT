import { FC } from "react";
import { MessageMediaResource } from "../../../../types/message";
import MessageOneMedia from "./MessageOneMedia";
import MessageTwoMedia from "./MessageTwoMedia";
import MessageMoreThanTwoMedia from "./MessageMoreThanTwoMedia";

type MessageIncludeVideoProps = {
    medias: MessageMediaResource[]
}

const MessageIncludeVideo: FC<MessageIncludeVideoProps> = ({
    medias
}) => {
    if (medias.length === 1) return <MessageOneMedia medias={medias} />

    if (medias.length === 2) return <MessageTwoMedia medias={medias} />

    if (medias.length > 2) return <MessageMoreThanTwoMedia medias={medias} />
};

export default MessageIncludeVideo;
