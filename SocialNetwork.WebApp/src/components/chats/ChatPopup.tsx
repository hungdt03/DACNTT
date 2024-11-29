import { FC } from "react";
import { CloseOutlined, MinusOutlined } from '@ant-design/icons'
import images from "../../assets";
import Message from "./messages/Message";
import { SendHorizonal } from "lucide-react";

const ChatPopup: FC = () => {
    return <div className="w-[300px] z-[2000] h-[450px] relative bg-white rounded-t-xl overflow-hidden shadow-md">
        <div className="bg-sky-500 text-white absolute top-0 left-0 right-0 shadow-md flex items-center justify-between border-[1px] border-gray-200 p-[2px]">
            <div className="flex items-center gap-x-2 rounded-md p-1">
                <div className="relative">
                    <img
                        src={images.user}
                        alt="Avatar"
                        className="w-[40px] h-[40px] rounded-full"
                    />
                    <span className="absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full border-2 border-white bg-green-500"></span>
                </div>

                <div className="flex flex-col">
                    <b className="text-sm">Nguyễn Văn A</b>
                    <p className="text-[13px]">Đang hoạt động</p>
                </div>
            </div>

            <div className="flex gap-x-1 items-center">
                <div title="Thu nhỏ đoạn chat">
                    <button className="p-2 bg-transparent border-none">
                        <MinusOutlined />
                    </button>
                </div>

                <div title="Đóng đoạn chat">
                    <button className="p-2 bg-transparent border-none">
                        <CloseOutlined />
                    </button>
                </div>
            </div>
        </div>

        <div className="overflow-y-auto absolute left-0 right-0 top-14 bottom-14 px-2 py-3 scrollbar-w-2 scrollbar-h-4 custom-scrollbar flex flex-col gap-y-3">
            <Message isMe />
            <Message isMe />
            <Message />
            <Message isMe />
            <Message />
            <Message isMe />
            <Message isMe />
            <Message />
            <Message />
            <Message isMe />
            <Message />
            <div></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white shadow border-t-[1px] border-gray-100">
            <div className="w-full p-2">
                <div className="flex items-center gap-x-1">
                    <div className="flex-shrink-0">
                        <button>
                            <img className="w-6 h-6" src={images.photo} />
                        </button>
                    </div>

                    <div className="bg-gray-100 px-1 py-1 rounded-3xl w-full flex justify-between">
                        <input className="px-2 flex-1 text-sm outline-none border-none bg-gray-100" placeholder="Nhập tin nhắn" />
                        <button className="w-8 h-8 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
                            <SendHorizonal size={16} className="text-sky-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

};

export default ChatPopup;
