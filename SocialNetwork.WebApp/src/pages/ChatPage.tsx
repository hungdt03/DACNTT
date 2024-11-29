import { FC } from "react";
import ChatArea from "../components/chats/ChatArea";
import ChatDetails from "../components/chats/ChatDetails";

const ChatPage: FC = () => {
    return <div className="grid grid-cols-12 h-full overflow-hidden">
        <ChatArea />
        <div className="col-span-4">
            <ChatDetails />
        </div>
    </div>
};

export default ChatPage;
