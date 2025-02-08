import { Avatar, Empty, Modal, Tabs, TabsProps } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Edit, Search } from "lucide-react";
import CreateGroupChatModal from "../modals/CreateGroupChatModal";
import cn from "../../utils/cn";
import ChatUserSkeleton from "../skeletons/ChatUserSkeleton";
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
