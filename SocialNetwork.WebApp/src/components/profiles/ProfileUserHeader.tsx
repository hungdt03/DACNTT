import { FC } from "react";
import images from "../../assets";
import { Button, Divider } from "antd";
import { Check, MessageSquareText, MoreHorizontal, Plus, User, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { UserResource } from "../../types/user";
import { FriendRequestResource } from "../../types/friendRequest";
import friendRequestService from "../../services/friendRequestService";
import { toast } from "react-toastify";
import { FriendRequestStatus } from "../../constants/friend-request";
import friendService from "../../services/friendService";

export type ProfileUserHeader = {
    user: UserResource;
    friendRequest: FriendRequestResource | null;
    onRefresh?: () => void
}

const ProfileUserHeader: FC<ProfileUserHeader> = ({
    user: targetUser,
    friendRequest,
    onRefresh
}) => {
    const { user } = useSelector(selectAuth);

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

    return <div className="bg-white w-full shadow">
        <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto overflow-hidden">
            <div className="w-full h-full relative z-10">
                <img className="w-full object-cover max-h-[25vh] h-full md:max-h-[40vh] rounded-b-xl" src={images.cover} />
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-end -mt-20 gap-x-6 lg:-mt-6 px-8">
                <img className="lg:w-44 lg:h-44 w-36 h-36 rounded-full border-[1px] border-primary z-30" src={targetUser?.avatar ?? images.user} />
                <div className="lg:py-6 py-3 flex flex-col lg:flex-row items-center gap-y-4 lg:gap-y-0 lg:items-end justify-between w-full">
                    <div className="flex flex-col items-center lg:items-start gap-y-1">
                        <span className="font-bold text-3xl">{targetUser?.fullName}</span>
                        <div className="flex items-center gap-x-3">
                            <span className="text-gray-500">3,8K người theo dõi</span>
                            <div className="bg-primary w-2 h-2 rounded-full"></div>
                            <span className="font-semibold text-gray-500">0 đang theo dõi</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-x-2">
                        {friendRequest?.status === FriendRequestStatus.ACCEPTED &&
                            <div className="flex items-center gap-x-2">
                                <Button onClick={handleDeleteFriend} icon={<X size={16} />} danger type='primary'>Hủy kết bạn</Button>
                                <button className="bg-sky-50 text-primary px-3 py-1 rounded-md flex items-end gap-x-2">
                                    <User className="mb-1" size={16} />
                                    Bạn bè
                                </button>
                            </div>
                        }

                        {!friendRequest && <Button onClick={handleSendFriendRequest} icon={<Plus size={16} />} type='primary'>Thêm bạn bè</Button>}

                        {friendRequest?.status === FriendRequestStatus.PENDING && friendRequest?.sender?.id !== user?.id && <div className="flex items-center gap-x-2">
                            <Button onClick={handleAcceptFriendRequest} icon={<Check size={16} />} type='primary'>Chấp nhận</Button>
                            <Button onClick={handleCancelFriendRequest} icon={<X size={16} />} type='default'>Gỡ lời mời</Button>
                        </div>}

                        {friendRequest?.status === FriendRequestStatus.PENDING && friendRequest?.sender?.id === user?.id && <Button onClick={handleCancelFriendRequest} icon={<X size={16} />} type='default'>Hủy lời mời</Button>}

                        <button className="bg-sky-50 text-primary px-3 py-1 rounded-md flex items-end gap-x-2">
                            <MessageSquareText className="mb-1" size={16} />
                            Nhắn tin
                        </button>
                        <Button icon={<MoreHorizontal size={16} />} type='primary'></Button>
                    </div>
                </div>
            </div>

            <Divider className="my-3" />
        </div>
    </div>
};

export default ProfileUserHeader;
