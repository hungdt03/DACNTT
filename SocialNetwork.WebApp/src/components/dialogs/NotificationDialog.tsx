import { FC } from "react";
import Notification from "../Notification";

const NotificationDialog: FC = () => {
    return <div className="flex flex-col gap-y-3 p-2 max-h-[600px] overflow-y-auto custom-scrollbar">
        <span className="font-semibold text-lg">Thông báo của bạn</span>
        <div className="flex flex-col gap-y-2">
            <Notification />
            <Notification />
            <Notification />
            <Notification />
            <Notification />
            <Notification />
            <Notification />
            <Notification />
            <Notification />
            <Notification />
            <Notification />
            <Notification />
        </div>
    </div>
};

export default NotificationDialog;
