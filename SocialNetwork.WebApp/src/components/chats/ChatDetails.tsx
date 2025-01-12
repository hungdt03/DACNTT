import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { Search, UserRound } from "lucide-react";
import { MessageMediaResource } from "../../types/message";
import { Pagination } from "../../types/response";
import chatRoomService from "../../services/chatRoomService";
import { MediaType } from "../../enums/media";
import { ChatRoomResource } from "../../types/chatRoom";
import { Link } from "react-router-dom";

type ChatDetailsProps = {
    chatRoom: ChatRoomResource;
}

const ChatDetails: FC<ChatDetailsProps> = ({
    chatRoom
}) => {
    const [fileMedias, setFileMedias] = useState<MessageMediaResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        size: 10,
        hasMore: false
    })

    const fetchFileMedias = async (page: number, size: number) => {
        const response = await chatRoomService.getMediasByChatRoomId(chatRoom.id, page, size);
        if (response.isSuccess) {
            setPagination(response.pagination);
            setFileMedias(prevMedias => [...prevMedias, ...response.data])
        }
    }

    useEffect(() => {
        setFileMedias([])
        fetchFileMedias(1, pagination.size)
    }, [chatRoom])

    return <div className="h-full border-l-[1px] border-gray-200 p-4">
        <div className="flex flex-col gap-y-8 h-full">
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col items-center gap-y-1">
                    <img src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} className="w-20 h-20 object-cover rounded-full" />
                    <span className="font-semibold text-lg">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                    <p className="text-xs text-gray-400">Hoạt động 34 phút trước</p>
                </div>
                <div className="flex items-center justify-center gap-x-4">
                    <Link to={`/profile/${chatRoom.friend?.id}`} className="flex flex-col items-center gap-y-1">
                        <div className="p-2 rounded-full text-black font-semibold bg-gray-100 w-10 h-10 flex items-center justify-center">
                            <UserRound size={18} />
                        </div>
                        <span className="text-xs text-gray-700">Trang cá nhân</span>
                    </Link>
                    <div className="flex flex-col items-center gap-y-1">
                        <div className="p-2 rounded-full text-black font-semibold bg-gray-100 w-10 h-10 flex items-center justify-center">
                            <Search size={18} />
                        </div>
                        <span className="text-xs text-gray-700">Tìm kiếm</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-2 h-full overflow-hidden">
                <span className="font-semibold text-[16px]">File phương tiện</span>

                <div className="h-full overflow-y-auto custom-scrollbar">
                    {fileMedias.length > 0 ? <div className="grid grid-cols-3 gap-1">
                        {fileMedias.map(media => {
                            if (media.mediaType === MediaType.IMAGE)
                                return <img className="object-cover w-full h-[120px]" key={media.id} src={media.mediaUrl} />

                            return <video key={media.id}
                                src={media.mediaUrl}
                                className="w-full object-cover h-[120px]"
                                controls
                            />
                        })}
                    </div> : <p className="text-center text-sm w-full">Chưa có file nào được gửi</p>}

                    {fileMedias.length > 0 && pagination.hasMore && <button onClick={() => fetchFileMedias(pagination.page + 1, pagination.size)} className="text-primary text-center w-full font-semibold my-2">Tải thêm</button>}
                </div>
            </div>
        </div>
    </div>
};

export default ChatDetails;
