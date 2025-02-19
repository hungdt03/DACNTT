import { FC } from "react";
import images from "../../../assets";
import { Avatar, Tooltip } from "antd";
import { MessageResource } from "../../../types/message";
import { formatTimeMessage } from "../../../utils/date";
import MessageMedia from "./MessageMedia";
import { ChatRoomResource } from "../../../types/chatRoom";

type MessageFromOtherProps = {
    message: MessageResource;
    chatRoom: ChatRoomResource
}

const MessageFromOther: FC<MessageFromOtherProps> = ({
    message,
    chatRoom
}) => {
    return <div className="flex flex-col gap-y-1">
        <span className="text-xs text-gray-500 pl-8">{!chatRoom.isPrivate && message.sender.fullName}</span>
        <div className="flex justify-start w-full">
            <div className="flex items-start gap-x-2 max-w-[70%] w-full">
                <Avatar className="flex-shrink-0" size='small' src={message.sender.avatar ?? images.user} />
                <div className="flex flex-col w-full items-start gap-y-1">
                    <Tooltip placement="right" title={<span className="text-[12px] w-full">{message.status === 'sending' ? 'Đang gửi' : `${formatTimeMessage(new Date(message.sentAt))}`}</span>}>
                        {message.medias && <MessageMedia medias={message.medias} />}
                        {message.content && <span className="inline-block bg-gray-200 text-black p-2 rounded-lg text-[13px] break-all break-words max-w-full w-fit">
                            {message.content}
                        </span>}
                    </Tooltip>
                </div>
            </div>
        </div>
    </div>
};

export default MessageFromOther;
