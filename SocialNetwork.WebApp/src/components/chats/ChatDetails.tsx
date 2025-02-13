import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { MoreHorizontal, UserPlus, UserRound } from "lucide-react";
import { MessageMediaResource } from "../../types/message";
import { Pagination } from "../../types/response";
import chatRoomService from "../../services/chatRoomService";
import { MediaType } from "../../enums/media";
import { ChatRoomResource } from "../../types/chatRoom";
import { Link } from "react-router-dom";
import { ChatRoomMemberResource } from "../../types/chat-room-member";
import { Avatar, Collapse, CollapseProps, message, Modal, Popconfirm, Popover, Tag } from "antd";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { UserResource } from "../../types/user";
import useModal from "../../hooks/useModal";
import AddFriendToChatRoom from "../modals/AddFriendToChatRoom";

type ChatDetailsProps = {
    chatRoom: ChatRoomResource;
}

const ChatDetails: FC<ChatDetailsProps> = ({
    chatRoom
}) => {
    const { user } = useSelector(selectAuth);
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal();
    const [members, setMembers] = useState<ChatRoomMemberResource[]>([]);

    const fetchChatRoomMembers = async () => {
        const response = await chatRoomService.getMembersByChatRoomId(chatRoom.id);
        if (response.isSuccess) {
            setMembers(response.data)
        }
    }
    
    useEffect(() => {
       fetchChatRoomMembers()
    }, [chatRoom])


    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thành viên',
            className: 'bg-white border-none',
            children: user && <MemberCollapse onFetch={fetchChatRoomMembers} isLeader={chatRoom.isAdmin} members={members} user={user} />,

        },
        {
            key: '2',
            label: 'File phương tiện',
            className: 'bg-white',
            children: user && <FileCollapse user={user} chatRoom={chatRoom} />
        },

    ];

    return <>
        <div className="h-full border-l-[1px] border-gray-200 p-4">
            <div className="flex flex-col gap-y-8 h-full">
                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col items-center gap-y-1">
                        <img src={chatRoom.isPrivate ? chatRoom.friend?.avatar : images.group} className="w-20 h-20 object-cover rounded-full" />
                        <span className="font-semibold text-lg">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                        <p className="text-xs text-gray-400">Hoạt động 34 phút trước</p>
                    </div>
                    <div className="flex items-center justify-center gap-x-4">
                        <div className="flex flex-col items-center gap-y-1">
                            <button onClick={showModal} className="p-2 rounded-full text-black font-semibold hover:bg-gray-200 bg-gray-100 w-10 h-10 flex items-center justify-center">
                                <UserPlus size={18} />
                            </button>
                            <span className="text-xs text-gray-700">Thêm</span>
                        </div>
                        <Link to={`/profile/${chatRoom.friend?.id}`} className="flex flex-col items-center gap-y-1">
                            <div className="p-2 rounded-full text-black font-semibold bg-gray-100 w-10 h-10 flex items-center justify-center">
                                <UserRound size={18} />
                            </div>
                            <span className="text-xs text-gray-700">Trang cá nhân</span>
                        </Link>
                    </div>
                </div>

                 {(chatRoom.isPrivate && chatRoom.isAccept) || !chatRoom.isPrivate && <Collapse className="overflow-y-auto" items={items} defaultActiveKey={['1']} />}
            </div>
        </div>

        <Modal
            style={{
                top: 20
            }}
            title={<p className="text-center font-bold text-lg">Thêm thành viên</p>}
            width='500px'
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            styles={{
                footer: {
                    display: 'none'
                }
            }}
        >
            <AddFriendToChatRoom
                chatRoomId={chatRoom.id}
                onSuccess={() => {
                    fetchChatRoomMembers()
                    handleOk()
                }}
            />
        </Modal>
    </>

}

export default ChatDetails;

type MemberCollapseProps = {
    user: UserResource;
    members: ChatRoomMemberResource[];
    isLeader: boolean;
    onFetch: () => void
}

const MemberCollapse: FC<MemberCollapseProps> = ({
    members,
    isLeader,
    onFetch,
    user
}) => {
    
    
    const handleKickMember = async (memberId: string) => {
        const response = await chatRoomService.kickMember(memberId);
        if (response.isSuccess) {
            message.success(response.message)
            onFetch()
        } else {
            message.error(response.message)
        }
    }

    const handleAddLeader = async (memberId: string) => {
        const response = await chatRoomService.chooseNewLeader(memberId);
        if (response.isSuccess) {
            message.success(response.message)
            onFetch()
        } else {
            message.error(response.message)
        }
    }


    return <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-y-2">
            {members.map(member => {
                return <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div className="flex items-center gap-x-2">
                        <Avatar src={member.user.avatar} />
                        <div className="flex flex-col">
                            <span className="font-semibold">{member.user.fullName}</span>
                            <span>{member.isLeader ? <Tag className="inline-block" color="green">Trưởng nhóm</Tag> : <Tag className="inline-block" color="gold">Thành viên</Tag>}</span>
                        </div>
                    </div>

                    {member.user.id !== user.id && <Popover placement="bottomLeft" content={<MemberMoreOption
                        member={member}
                        isLeader={isLeader}
                        onAddLeader={() => handleAddLeader(member.id)}
                        onKick={() => handleKickMember(member.id)}
                    />}>
                        <button className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100">
                            <MoreHorizontal size={15} />
                        </button>
                    </Popover>}
                </div>
            })}
        </div>
    </div>
}

type MemberMoreOptionProps = {
    onAddLeader: () => void;
    onKick: () => void;
    member: ChatRoomMemberResource;
    isLeader: boolean;
}

const MemberMoreOption: FC<MemberMoreOptionProps> = ({
    onAddLeader,
    onKick,
    member,
    isLeader
}) => {
    return <div className="flex flex-col">
        <Link className="p-2 text-left rounded-md hover:bg-gray-100 hover:text-black" to={`/profile/${member.user.id}`}>Trang cá nhân</Link>
        {isLeader && <>
            <Popconfirm cancelText='Hủy' okText='OK' onConfirm={onKick} title='Xóa khỏi nhóm' description={`Xóa ${member.user.fullName} khỏi nhóm`}>
                <button className="p-2 text-left rounded-md hover:bg-gray-100">Xóa khỏi nhóm</button>
            </Popconfirm>
            <Popconfirm cancelText='Hủy' okText='OK' title='Trưởng nhóm' description={`Thêm ${member.user.fullName} làm trưởng nhóm`}>
                <button onClick={onAddLeader} className="p-2 text-left rounded-md hover:bg-gray-100">Làm nhóm trưởng</button>
            </Popconfirm>
        </>}
    </div>
}


type FileCollapseProps = {
    chatRoom: ChatRoomResource;
    user: UserResource
}

const FileCollapse: FC<FileCollapseProps> = ({
    chatRoom,
    user
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
        fetchFileMedias(1, pagination.size);

    }, [chatRoom])

    return <div className="h-full overflow-y-auto custom-scrollbar">
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
}