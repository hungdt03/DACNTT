import { FC, useEffect, useState } from "react";
import { Check, Edit3, LogOut, MoreHorizontal, UserPlus, UserRound, X } from "lucide-react";
import { MessageMediaResource } from "../../types/message";
import { Pagination } from "../../types/response";
import chatRoomService from "../../services/chatRoomService";
import { MediaType } from "../../enums/media";
import { ChatRoomResource } from "../../types/chatRoom";
import { Link } from "react-router-dom";
import { ChatRoomMemberResource } from "../../types/chat-room-member";
import { Avatar, Button, Collapse, CollapseProps, Input, message, Modal, Popconfirm, Popover, Tag } from "antd";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { UserResource } from "../../types/user";
import useModal from "../../hooks/useModal";
import AddFriendToChatRoom from "../modals/AddFriendToChatRoom";
import { CameraIcon } from "@heroicons/react/24/outline";
import { formatTime } from "../../utils/date";

type ChatDetailsProps = {
    chatRoom: ChatRoomResource;
    onFetch: () => void
}

const ChatDetails: FC<ChatDetailsProps> = ({
    chatRoom,
    onFetch
}) => {
    const { user } = useSelector(selectAuth);
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal();
    const [members, setMembers] = useState<ChatRoomMemberResource[]>([]);

    const [roomImage, setRoomImage] = useState(chatRoom.isPrivate ? chatRoom.friend?.avatar : chatRoom.imageUrl);
    const [tempFile, setTempFile] = useState<File>();
    const [loading, setLoading] = useState(false)
    const [isUpload, setIsUpload] = useState(false)

    const [isEdit, setIsEdit] = useState(false)
    const [editName, setEditName] = useState(chatRoom.name);

    const fetchChatRoomMembers = async () => {
        const response = await chatRoomService.getMembersByChatRoomId(chatRoom.id);
        if (response.isSuccess) {
            setMembers(response.data)
        }
    }

    useEffect(() => {
        fetchChatRoomMembers();
        setEditName(chatRoom.name);
        setRoomImage(chatRoom.isPrivate ? chatRoom.friend?.avatar : chatRoom.imageUrl)
    }, [chatRoom])


    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thành viên',
            className: `bg-white border-none ${chatRoom.isPrivate && 'hidden'}`,
            children: user && <MemberCollapse onFetch={fetchChatRoomMembers} isLeader={chatRoom.isAdmin} members={members} user={user} />,
        },
        {
            key: '2',
            label: 'File phương tiện',
            className: 'bg-white',
            children: user && <FileCollapse user={user} chatRoom={chatRoom} />
        },

    ]

    const handleLeaveGroup = async () => {
        const response = await chatRoomService.leaveGroup(chatRoom.id);
        if (response.isSuccess) {
            onFetch()
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const handleUpdateChatRoomName = async () => {
        const response = await chatRoomService.changeRoomName(chatRoom.id, editName);
        if (response.isSuccess) {
            message.success(response.message)
            onFetch()
            setIsEdit(false)
        } else {
            message.error(response.message)
        }
    }

    const handleUploadChange = (files: FileList | null) => {
        if (files?.[0]) {
            setTempFile(files[0]);
            const tempUrl = URL.createObjectURL(files[0]);
            setRoomImage(tempUrl);
            setIsUpload(true)
        }
    }

    const handleChangeRoomImage = async () => {
        const formData = new FormData();
        formData.append('chatRoomId', chatRoom.id);
        if (tempFile) {
            formData.append('image', tempFile);
        } else {
            message.error('Vui lòng chọn tệp ảnh');
            return;
        }

        setLoading(true)
        const response = await chatRoomService.uploadRoomImage(formData);
        setLoading(false)

        if (response.isSuccess) {
            message.success(response.message)
            onFetch()
            setIsUpload(false)
            setTempFile(undefined)
        } else {
            message.error(response.message)
        }
    }

    const handleCancelUpload = () => {
        setIsUpload(false);
        setRoomImage(chatRoom.imageUrl);
        setTempFile(undefined)
    }

    useEffect(() => {
        return () => {
            if (roomImage && tempFile) {
                URL.revokeObjectURL(roomImage);
            }
        };
    }, [roomImage, chatRoom]);

    return <>
        <div className="h-full border-l-[1px] border-gray-200 p-4">
            <div className="flex flex-col gap-y-8 h-full">
                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col items-center gap-y-1">
                        <div className="relative">
                            <img src={roomImage} className="w-20 h-20 object-cover rounded-full" />

                            {!chatRoom.isPrivate && <label htmlFor="upload-room-name" className="cursor-pointer absolute bottom-2 right-2 w-6 h-6 bg-gray-100 flex items-center justify-center rounded-full shadow border-[1px] border-gray-400">
                                <CameraIcon color="gray" width={18} />
                            </label>}

                            <input disabled={loading} onChange={(e) => handleUploadChange(e.target.files)} type="file" hidden id="upload-room-name" />
                        </div>

                        {isUpload && <div className="flex justify-end gap-x-2">
                            <button disabled={loading} onClick={handleCancelUpload} className="text-sm w-[25px] h-[25px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                                <X size={14} />
                            </button>
                            <Button loading={loading} disabled={!tempFile} onClick={handleChangeRoomImage} size="small" shape="circle" type="primary">
                                <Check size={16} />
                            </Button>
                        </div>}

                        {isEdit && <div className="flex flex-col gap-y-1">
                            <Input placeholder='Nhập tên nhóm'
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                            <div className="flex justify-end gap-x-2">
                                <button onClick={() => setIsEdit(false)} className="text-sm px-2 py-[7px] rounded-md bg-gray-100 hover:bg-gray-200">Hủy</button>
                                <Button disabled={editName.trim().length === 0 || chatRoom.name === editName} onClick={handleUpdateChatRoomName} type="primary">Lưu</Button>
                            </div>
                        </div>}

                        {!isEdit && <div className="flex items-center gap-x-1">
                            <span className="font-semibold text-lg">{chatRoom.isPrivate ? chatRoom.friend?.fullName : chatRoom.name}</span>
                            {!chatRoom.isPrivate && <button onClick={() => setIsEdit(true)} className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center">
                                <Edit3 size={14} />
                            </button>}
                        </div>}

                        <p className="text-xs text-gray-400">
                            {chatRoom.isOnline ? 'Đang hoạt động' : `Hoạt động ${formatTime(new Date(chatRoom.recentOnlineTime))}`}
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-x-4">
                        {chatRoom.isAdmin && !chatRoom.isPrivate && <div className="flex flex-col items-center gap-y-1">
                            <button onClick={showModal} className="p-2 rounded-full text-black font-semibold hover:bg-gray-200 bg-gray-100 w-10 h-10 flex items-center justify-center">
                                <UserPlus size={18} />
                            </button>
                            <span className="text-xs text-gray-700">Thêm</span>
                        </div>}
                        {chatRoom.isPrivate && <Link to={`/profile/${chatRoom.friend?.id}`} className="flex flex-col items-center gap-y-1">
                            <div className="p-2 rounded-full text-black font-semibold bg-gray-100 w-10 h-10 flex items-center justify-center">
                                <UserRound size={18} />
                            </div>
                            <span className="text-xs text-gray-700">Trang cá nhân</span>
                        </Link>}

                        {!chatRoom.isPrivate && <div className="flex flex-col items-center gap-y-1">
                            <button onClick={handleLeaveGroup} className="p-2 rounded-full text-black font-semibold hover:bg-gray-200 bg-gray-100 w-10 h-10 flex items-center justify-center">
                                <LogOut size={18} />
                            </button>
                            <span className="text-xs text-gray-700">Rời nhóm</span>
                        </div>}
                    </div>
                </div>

                <Collapse className="overflow-y-auto" items={items} defaultActiveKey={['1']} />
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