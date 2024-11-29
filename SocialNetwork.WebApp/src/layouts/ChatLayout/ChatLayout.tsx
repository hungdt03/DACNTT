import { FC } from "react";
import ChatSidebar from "./components/ChatSidebar";
import { Outlet } from "react-router-dom";

const ChatLayout: FC = () => {
    return <div className="grid grid-cols-12 h-screen">
        <ChatSidebar />
        <div className="col-span-9 overflow-hidden">
            <Outlet />
        </div>
    </div>
};

export default ChatLayout;
