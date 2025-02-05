import { FC } from "react";
import { MessageResource } from "../../../types/message";
import { formatTimeMessage } from "../../../utils/date";
import MessageMedia from "./MessageMedia";

type MessageFromMeProps = {
    message: MessageResource
}

const MessageFromMe: FC<MessageFromMeProps> = ({
    message
}) => {
    return <div className="flex justify-end w-full">
        <div className="flex flex-col items-end gap-y-1 max-w-[70%] w-full">
            {message.medias && <MessageMedia medias={message.medias} />}
            {message.content && <p className="bg-sky-500 text-white p-2 rounded-lg text-sm break-words max-w-full">
                {message.content}
            </p>}
            <span className="text-xs text-gray-400 pl-1">{message.status === 'sending' ? 'Đang gửi' : `Đã gửi vào lúc ${formatTimeMessage(new Date(message.sentAt))}`}</span>
        </div>
    </div>
};

export default MessageFromMe;
