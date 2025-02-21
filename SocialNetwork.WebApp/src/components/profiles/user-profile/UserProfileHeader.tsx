import { Check, MessageSquareText, MoreHorizontal, Plus, User, UserCheckIcon, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { selectAuth } from "../../../features/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import images from "../../../assets";
import { Avatar, Button, Modal, Popover, Tooltip, message } from "antd";
import { FriendRequestResource } from "../../../types/friendRequest";
import { UserResource } from "../../../types/user";
import friendRequestService from "../../../services/friendRequestService";
import { toast } from "react-toastify";
import friendService from "../../../services/friendService";
import { FriendRequestStatus } from "../../../enums/friend-request";
import followService from "../../../services/followService";
import { FriendResource } from "../../../types/friend";
import UserProfileMoreAction from "./UserProfileMoreAction";
import useModal from "../../../hooks/useModal";
import ReportPostModal from "../../modals/reports/ReportPostModal";
import reportService from "../../../services/reportService";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../../services/userService";
import chatRoomService from "../../../services/chatRoomService";
import { AppDispatch } from "../../../app/store";
import { add, remove } from "../../../features/slices/chat-popup-slice";
import { ChatRoomResource } from "../../../types/chatRoom";


type UserProfileHeaderProps = {
    user: UserResource;
    friends: FriendResource[]
    friendRequest: FriendRequestResource | null;
    onRefresh?: () => void
}

const UserProfileHeader: FC<UserProfileHeaderProps> = ({
    user: targetUser,
    friendRequest,
    friends,
    onRefresh
}) => {

    const { user } = useSelector(selectAuth);
    const [isFollow, setIsFollow] = useState(false);
    const [reason, setReason] = useState('');
    const navigate = useNavigate();
    const [chatRoom, setChatRoom] = useState<ChatRoomResource>();
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch<AppDispatch>()

    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const { isModalOpen: openReport, handleCancel: cancelReport, handleOk: okReport, showModal: showReport } = useModal()

    const handleSendFriendRequest = async () => {
        const response = await friendRequestService.createFriendRequest(targetUser.id)
        if (response.isSuccess) {
            onRefresh?.()
            toast.success(response.message)
        } else {
            onRefresh?.()
            toast.error(response.message)
        }
    };

    const handleCancelFriendRequest = async () => {
        const response = await friendRequestService.cancelFriendRequest(friendRequest!.id)
        if (response.isSuccess) {
            onRefresh?.()
            toast.success(response.message)
        } else {
            onRefresh?.()
            toast.error(response.message)
        }
    };

    const handleAcceptFriendRequest = async () => {
        const response = await friendRequestService.acceptFriendRequest(friendRequest!.id)
        if (response.isSuccess) {
            onRefresh?.()
            toast.success(response.message)
        } else {
            toast.error(response.message)
        }
    };

    const handleDeleteFriend = async () => {
        const response = await friendService.deleteFriend(targetUser.id);
        if (response.isSuccess) {
            onRefresh?.()
            toast.success(response.message)
        } else {
            onRefresh?.()
            toast.error(response.message)
        }
    }

    const handleFollowUser = async (followeeId: string) => {
        const response = await followService.followUser(followeeId);
        if (response.isSuccess) {
            message.success(response.message)
            setIsFollow(true)
        } else {
            message.error(response.message)
        }
    }

    const handleUnfollowUser = async (followeeId: string) => {
        const response = await followService.unfollowUser(followeeId);
        if (response.isSuccess) {
            message.success(response.message)
            setIsFollow(false)
        } else {
            message.error(response.message)
        }
    }

    const handleBlockUser = async () => {
        const response = await userService.blockUser(targetUser.id);
        if (response.isSuccess) {
            message.success(response.message);
            navigate('/');
            if (chatRoom)
                dispatch(remove(chatRoom.id))
        } else {
            message.error(response.message)
        }
    }

    const handleReportUser = async (reason: string) => {
        const response = await reportService.reportUser(targetUser.id, reason);
        if (response.isSuccess) {
            message.success(response.message);
            okReport()
            setReason('')
          
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        const checkIsFollow = async () => {
            const response = await followService.checkFollowUser(targetUser.id);
            if (response.isSuccess) setIsFollow(true)
            else setIsFollow(false)
        }

        checkIsFollow()
    }, [targetUser])

    const handleGetOrCreateChatRoom = async () => {
        setLoading(true)
        const response = await chatRoomService.getOrCreateChatRoom(targetUser.id);
        setLoading(false)
        if (response.isSuccess) {
            setChatRoom(response.data)
            dispatch(add(response.data))
        } else {
            message.error('Vui lòng refresh trang và thử lại')
        }
    }

    return <div className="xl:max-w-screen-lg lg:max-w-screen-lg lg:px-0 md:max-w-screen-md max-w-screen-sm px-2 mx-auto w-full bg-white pb-6">
        <div className="w-full h-full relative z-10">
            <img className="w-full object-cover max-h-[25vh] h-full md:max-h-[30vh] rounded-lg" alt="Ảnh bìa" src={targetUser.coverImage} />
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-end md:ml-10 ml-0 -mt-16 gap-x-6 lg:-mt-8 px-8">
            <div className="relative flex-shrink-0 z-30">
                {targetUser?.haveStory ?
                    <Link className="lg:w-32 lg:h-32 w-28 h-28 rounded-full border-[4px] p-[2px] border-primary flex items-center justify-center aspect-square" to={`/stories/${targetUser.id}`}>
                        <img alt="Ảnh đại diện" className="object-cover aspect-square w-full h-full rounded-full" src={targetUser?.avatar ?? images.user} />
                    </Link>
                    : <img
                        alt="Ảnh đại diện"
                        className="z-30 lg:w-32 lg:h-32 w-28 h-28 rounded-full object-cover aspect-square"
                        src={targetUser?.avatar ?? images.user}
                    />
                }

                {targetUser.isShowStatus && targetUser?.isOnline && <div className="absolute bottom-2 right-3 p-2 rounded-full border-[2px] border-white bg-green-500"></div>}
            </div>
            <div className="lg:py-6 py-3 flex flex-col lg:flex-row items-center gap-y-4 lg:gap-y-0 lg:items-end justify-between w-full">
                <div className="flex flex-col items-center lg:items-start gap-y-3">
                    <span className="font-bold text-2xl">{targetUser?.fullName}</span>
                    <div className="flex items-center flex-wrap justify-center gap-x-3 gap-y-2 text-sm md:text-[15px]">
                        <span className="font-semibold text-gray-500">{targetUser?.friendCount} người bạn</span>
                        <div className="bg-primary w-2 h-2 rounded-full"></div>
                        <span className="font-semibold text-gray-500">{targetUser?.followingCount} đang theo dõi</span>
                        <div className="bg-primary w-2 h-2 rounded-full"></div>
                        <span className="font-semibold text-gray-500">{targetUser?.followerCount} theo dõi</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full flex flex-col-reverse gap-y-4 md:flex-row justify-between">
            <Avatar.Group>
                {friends.map(friend => <Tooltip key={friend.id} title={friend.fullName}>
                    <Avatar src={friend.avatar} />
                </Tooltip>)}
            </Avatar.Group>
            <div className="flex items-center justify-center gap-x-2">
                {friendRequest?.status === FriendRequestStatus.ACCEPTED &&
                    <div className="flex items-center gap-x-2">
                        <Popover trigger='click' placement="bottom" content={<Button onClick={handleDeleteFriend} icon={<X size={16} />} danger type='primary'>Hủy kết bạn</Button>}>
                            <button className="bg-sky-50 text-primary px-3 py-1 rounded-md flex items-end gap-x-2">
                                <User className="mb-1" size={16} />
                                Bạn bè
                            </button>
                        </Popover>
                    </div>
                }

                {(!friendRequest) && <Button onClick={handleSendFriendRequest} icon={<Plus size={16} />} type='primary'>Thêm bạn bè</Button>}

                {friendRequest?.status === FriendRequestStatus.PENDING && friendRequest?.sender?.id !== user?.id && <div className="flex items-center gap-x-2">
                    <Button onClick={handleAcceptFriendRequest} icon={<Check size={16} />} type='primary'>Chấp nhận</Button>
                    <button onClick={handleCancelFriendRequest} className="flex items-center gap-x-2 px-3 py-1 rounded-md text-gray-600 font-semibold bg-slate-200">
                        <X size={16} />
                        Gỡ lời mời
                    </button>
                </div>}

                {friendRequest?.status === FriendRequestStatus.PENDING && friendRequest?.sender?.id === user?.id && <button onClick={handleCancelFriendRequest} className="flex items-center gap-x-2 px-3 py-1 rounded-md text-gray-600 font-semibold bg-slate-200">
                    <X size={16} />
                    Gỡ lời mời
                </button>}

                {friendRequest?.status !== FriendRequestStatus.ACCEPTED && !isFollow ? <Button onClick={() => handleFollowUser(targetUser.id)} type="primary" icon={<UserCheckIcon size={16} />}>
                    Theo dõi
                </Button> : (friendRequest?.status !== FriendRequestStatus.ACCEPTED && isFollow) &&
                <Popover content={<Button onClick={() => handleUnfollowUser(targetUser.id)} icon={<X size={16} />} danger type='primary'>Bỏ theo dõi</Button>}>
                    <button className="flex items-center gap-x-2 px-3 py-1 rounded-md text-gray-600 font-semibold bg-slate-200">
                        <UserCheckIcon size={16} />
                        Đang theo dõi
                    </button>
                </Popover>

                }

                <Button loading={loading} onClick={handleGetOrCreateChatRoom} type="primary" icon={<MessageSquareText className="mb-1" size={16} />}>
                    Nhắn tin
                </Button>

                <Popover content={<UserProfileMoreAction
                    onBlockUser={showModal}
                    onReportUser={showReport}
                />}>
                    <Button type="primary" icon={<MoreHorizontal size={16} />}>
                    </Button>
                </Popover>

            </div>
        </div>

        <Modal
            title={<p className="text-center font-bold text-lg">{`Chặn ${targetUser.fullName}?`}</p>}
            centered
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Xác nhận'
            cancelText='Hủy'
            okButtonProps={{
                onClick: () => void handleBlockUser(),
            }}
        >
            <div className="flex flex-col gap-y-2">
                <span className="text-[15px]"><strong>{targetUser.fullName}</strong> sẽ không thể:</span>
                <ul className="pl-2 flex flex-col gap-y-1">
                    <li>Xem bài viết trên dòng thời gian của bạn</li>
                    <li>Gắn thẻ bạn</li>
                    <li>Mời bạn tham gia nhóm</li>
                    <li>Nhắn tin cho bạn</li>
                    <li>Thêm bạn làm bạn bè</li>
                </ul>

                <p className="text-[15px]">Nếu các bạn là bạn bè, việc chặn <strong>{targetUser.fullName}</strong> cũng sẽ hủy kết bạn với anh ấy.</p>
            </div>
        </Modal>

        {/* REPORT TO ADMIN OF APP */}
        <Modal
            title={<p className="text-center font-bold text-lg">Báo cáo {targetUser.fullName}</p>}
            centered
            open={openReport}
            onOk={okReport}
            onCancel={cancelReport}
            okText='Gửi báo cáo'
            cancelText='Hủy'
            okButtonProps={{
                onClick: () => reason.trim().length >= 20 && void handleReportUser(reason),
                disabled: reason.trim().length < 20
            }}
        >
            <ReportPostModal
                value={reason}
                onChange={(newValue) => setReason(newValue)}
                title="Tại sao bạn báo cáo người này này"
                description="Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy tìm ngay sự giúp đỡ trước khi báo cáo với LinkUp."
            />
        </Modal>
    </div>
};

export default UserProfileHeader;
