import { createContext } from "react";
import { UserResource } from "../../types/user";

type WebRtcContextType = {
    handleCallUser: (user: UserResource) => void
}

const NotificationContext = createContext<WebRtcContextType | undefined>(undefined);

export default NotificationContext;