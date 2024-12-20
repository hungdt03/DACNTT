import { Avatar } from "antd";
import { FC } from "react";
import images from "../../assets";
import Message from "./messages/Message";
import BoxSendMessage from "./BoxSendMessage";

const ChatArea: FC = () => {
    return <div className="col-span-8 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-[0.5px] border-sky-200 rounded-xl">
            <div className="flex justify-center items-center gap-x-3">
                <div className="relative">
                    <Avatar className="w-12 h-12" size='large' src={images.user} />
                    <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-semibold">Trần Phan Hoàn Việt</span>
                    <p className="text-sm text-gray-600">Đang hoạt động</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col h-full gap-y-3 w-full overflow-y-auto custom-scrollbar border-[1px] border-sky-300 rounded-xl p-4">
            {/* <Message />
            <Message isMe />
            <Message />
            <Message isMe />
            <Message />
            <Message />
            <Message isMe />
            <Message isMe />
            <Message />
            <Message />
            <Message />
            <Message isMe />
            <Message isMe /> */}
        </div>

        <div className="w-full px-4 py-4 border-[1px] border-sky-300 rounded-xl">
            <BoxSendMessage />
        </div>
    </div>
};

export default ChatArea;
