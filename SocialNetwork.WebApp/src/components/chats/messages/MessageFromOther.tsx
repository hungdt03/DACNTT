import { FC } from "react";
import images from "../../../assets";
import { Avatar } from "antd";
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
                    {message.medias && <MessageMedia medias={message.medias} />}
                    {message.content && <div className="bg-gray-200 text-gray-700 p-2 rounded-lg text-sm max-w-full break-words">
                        {message.content}
                    </div>}
                    <span className="text-xs text-gray-400 pl-1">Đã gửi vào lúc {formatTimeMessage(new Date(message.sentAt))}</span>
                </div>
            </div>
        </div>
    </div>
};

export default MessageFromOther;
