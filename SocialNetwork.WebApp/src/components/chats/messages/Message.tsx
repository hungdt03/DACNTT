import { FC } from "react";
import MessageFromMe from "./MessageFromMe";
import MessageFromOther from "./MessageFromOther";
import { MessageResource } from "../../../types/message";
import { Avatar, Tooltip } from "antd";
import images from "../../../assets";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { ChatRoomResource } from "../../../types/chatRoom";
import MessageSystem from "./MessageSystem";

type MessageProps = {
    isMe?: boolean;
    chatRoom: ChatRoomResource
    message: MessageResource
}

const Message: FC<MessageProps> = ({
    isMe=false,
    message,
    chatRoom
}) => {
    const { user } = useSelector(selectAuth)
    return <div className="flex flex-col gap-y-1">
        {isMe ? <MessageFromMe isShowCheck={false} message={message} /> : message.sender ? <MessageFromOther chatRoom={chatRoom} message={message} /> : <MessageSystem message={message} />}
        <div className="flex justify-end gap-x-1">
            {((chatRoom.isRecipientAccepted && chatRoom.isPrivate) || !chatRoom.isPrivate) && message?.reads?.filter(read => read.userId !== user?.id).map(read => 
                <Tooltip key={read?.user?.id} title={read?.user?.fullName ?? 'Anonymous user'}>
                    <Avatar className="w-4 h-4" src={read?.user?.avatar ?? images.user} />
                </Tooltip>
            )}
        </div>
    </div>
};

export default Message;
