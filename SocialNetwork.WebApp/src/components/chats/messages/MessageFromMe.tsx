import { FC } from "react";
import { MessageResource } from "../../../types/message";
import { formatTimeMessage } from "../../../utils/date";
import MessageMedia from "./MessageMedia";
import { Check } from "lucide-react";
import { Tooltip } from "antd";

type MessageFromMeProps = {
    message: MessageResource;
    isShowCheck: boolean;
}

const MessageFromMe: FC<MessageFromMeProps> = ({
    message,
    isShowCheck
}) => {
    return <div className="flex justify-end w-full">
        <div className="flex flex-col items-end gap-y-1 max-w-[70%] w-full">
            <Tooltip placement="left" title={<span className="text-[12px]">{message.status === 'sending' ? 'Đang gửi' : `${formatTimeMessage(new Date(message.sentAt))}`}</span>}>
                {message.medias && <MessageMedia medias={message.medias} />}
                {message.content && <p className="bg-sky-500 text-white p-2 rounded-lg text-sm break-words max-w-full">
                    {message.content}
                </p>}
            </Tooltip>
            {message.status === 'sending'
                ? <span className="text-xs text-gray-400 pl-1">Đang gửi</span>
                : isShowCheck && <div className="p-[2px] rounded-full flex items-center justify-center bg-primary">
                    <Check className="text-white" strokeWidth={3} size={8} />
                </div>
            }

        </div>

    </div>


};

export default MessageFromMe;
