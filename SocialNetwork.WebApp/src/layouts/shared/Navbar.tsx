import { Bell, Menu, MessageSquare } from "lucide-react";
import { FC } from "react";
import images from "../../assets";
import { Badge, Popover } from "antd";
import NotificationDialog from "../../components/dialogs/NotificationDialog";
import MessengerDialog from "../../components/dialogs/MessengerDialog";

const Navbar: FC = () => {
    return <div className="flex items-center gap-x-3">
        <Badge count={2}>
            <Popover trigger='click' placement="topRight" content={<NotificationDialog />}>
                <button className="p-3 rounded-md bg-gray-100">
                    <Menu className="text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Badge count={2}>
            <Popover trigger='click' placement="topRight" content={<NotificationDialog />}>
                <button className="p-3 rounded-md bg-gray-100">
                    <Bell className="text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <Badge count={3}>
            <Popover trigger='click' content={<MessengerDialog />}>
                <button className="p-3 rounded-md bg-gray-100">
                    <MessageSquare className="text-gray-500" size={18} />
                </button>
            </Popover>
        </Badge>
        <div>
            <img width='36px' height='36px' src={images.user} />
        </div>
    </div>
};

export default Navbar;
