import { FC } from "react";
import MessageFromMe from "./MessageFromMe";
import MessageFromOther from "./MessageFromOther";

type MessageProps = {
    isMe?: boolean;
}

const Message: FC<MessageProps> = ({
    isMe=false
}) => {
    return isMe ? <MessageFromMe /> : <MessageFromOther />
};

export default Message;
