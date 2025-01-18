import { createContext } from "react";
import { ChatRoomResource } from "../../types/chatRoom";

type WebRtcContextType = {
    handleCall: (chatRoom: ChatRoomResource) => void
}

const NotificationContext = createContext<WebRtcContextType | undefined>(undefined);

export default NotificationContext;