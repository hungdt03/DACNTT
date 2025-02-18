import { Tabs } from "antd";
import { FC } from "react";
import ChatRoomTab from "../chats/ChatRoomTab";
import PendingChatTab from "../chats/PendingChatTab";
import { ChatRoomResource } from "../../types/chatRoom";


type MessengerDialogProps = {
    chatRooms: ChatRoomResource[];
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onFetchChatRooms: () => void
    onUpdateChatRooms: (chatRooms: ChatRoomResource[]) => void
}

const MessengerDialog: FC<MessengerDialogProps> = ({
    chatRooms,
    loading,
    setLoading,
    onFetchChatRooms,
    onUpdateChatRooms
}) => {

    return <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        <Tabs
            items={[{
                key: "1",
                label: "Hội thoại",
                children: <ChatRoomTab onUpdateChatRooms={onUpdateChatRooms} chatRooms={chatRooms} loading={loading} setLoading={setLoading} onFetchChatRooms={onFetchChatRooms} />,
            },
            {
                key: "2",
                label: "Đang chờ",
                children: <PendingChatTab />,
            },]}
        />
    </div>
};

export default MessengerDialog;
