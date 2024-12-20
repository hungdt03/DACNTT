import { FC } from "react";
import MessageFromMe from "./MessageFromMe";
import MessageFromOther from "./MessageFromOther";
import { MessageResource } from "../../../types/message";

type MessageProps = {
    isMe?: boolean;
    message: MessageResource
}

const Message: FC<MessageProps> = ({
    isMe=false,
    message
}) => {
    return isMe ? <MessageFromMe message={message} /> : <MessageFromOther message={message} />
};

export default Message;
