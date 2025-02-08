import { FC } from "react";
import { MessageResource } from "../../../types/message";

type MessageSystemProps = {
    message: MessageResource
}

const MessageSystem: FC<MessageSystemProps> = ({
    message,
}) => {
    return <div className="flex flex-col items-center gap-y-1">
       <p className="text-xs text-center text-gray-500 px-3">{message.content}</p>
    </div>
};

export default MessageSystem;
