import { Tabs} from "antd";
import { FC } from "react";
import ChatRoomTab from "../chats/ChatRoomTab";
import PendingChatTab from "../chats/PendingChatTab";


type MessengerDialogProps = {
    onCountChatRoom: (count: number) => void
}

const MessengerDialog: FC<MessengerDialogProps> = ({
    onCountChatRoom
}) => {

    return <Tabs
        items={[{
            key: "1",
            label: "Hội thoại",
            children: <ChatRoomTab onCountChatRoom={onCountChatRoom} />,
        },
        {
            key: "2",
            label: "Đang chờ",
            children: <PendingChatTab />,
        },]}
    />
};

export default MessengerDialog;
