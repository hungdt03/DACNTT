import { Check, MessageSquareText, MoreHorizontal, Plus, User, UserCheckIcon, X } from "lucide-react";
import { FC } from "react";
import { selectAuth } from "../../features/slices/auth-slice";
import { useSelector } from "react-redux";
import images from "../../assets";
import { Avatar, Button, Divider, Popover } from "antd";
import ProfilePostList from "./ProfilePostList";
import { FriendRequestResource } from "../../types/friendRequest";
import { UserResource } from "../../types/user";
import friendRequestService from "../../services/friendRequestService";
import { toast } from "react-toastify";
import friendService from "../../services/friendService";
import { FriendRequestStatus } from "../../enums/friend-request";

type ProfileUserContentProps = {
    user: UserResource;
    friendRequest: FriendRequestResource | null;
    onRefresh?: () => void
}

const ProfileUserContent: FC<ProfileUserContentProps> = ({
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


    return <div className="bg-transparent w-full col-span-12 lg:col-span-8 overflow-y-auto scrollbar-hide py-4">
        <div className="flex flex-col gap-y-4 overflow-y-auto shadow">
            <div className="w-full h-full relative z-10">
                <img className="w-full object-cover max-h-[25vh] h-full md:max-h-[30vh] rounded-lg" alt="Ảnh bìa" src={images.cover} />
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-end -mt-20 gap-x-6 lg:-mt-12 px-8">
                <img alt="Ảnh đại diện" className="lg:w-32 lg:h-32 w-28 h-28 rounded-full border-[1px] border-primary z-30" src={targetUser?.avatar ?? images.user} />
                <div className="lg:py-6 py-3 flex flex-col lg:flex-row items-center gap-y-4 lg:gap-y-0 lg:items-end justify-between w-full">
                    <div className="flex flex-col items-center lg:items-start gap-y-1">
                        <span className="font-bold text-2xl">{targetUser?.fullName}</span>
                        <div className="flex items-center gap-x-3">
                            <span className="text-gray-500">{user?.friendCount} người bạn</span>
                            <div className="bg-primary w-2 h-2 rounded-full"></div>
                            <span className="font-semibold text-gray-500">0 đang theo dõi</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-between">
                <Avatar.Group>
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                </Avatar.Group>
                <div className="flex items-center gap-x-2">
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

                    {!friendRequest && <Button onClick={handleSendFriendRequest} icon={<Plus size={16} />} type='primary'>Thêm bạn bè</Button>}

                    {friendRequest?.status === FriendRequestStatus.PENDING && friendRequest?.sender?.id !== user?.id && <div className="flex items-center gap-x-2">
                        <Button onClick={handleAcceptFriendRequest} icon={<Check size={16} />} type='primary'>Chấp nhận</Button>
                        <Button onClick={handleCancelFriendRequest} icon={<X size={16} />} type='default'>Gỡ lời mời</Button>
                    </div>}

                    {friendRequest?.status === FriendRequestStatus.PENDING && friendRequest?.sender?.id === user?.id && <Button onClick={handleCancelFriendRequest} icon={<X size={16} />} type='default'>Hủy lời mời</Button>}

                    {friendRequest?.status !== FriendRequestStatus.ACCEPTED && <button className="bg-sky-50 text-primary px-3 py-1 rounded-md flex items-end gap-x-2">
                        <UserCheckIcon  className="mb-1" size={16} />
                        Theo dõi
                    </button>}
                    <button className="bg-sky-50 text-primary px-3 py-1 rounded-md flex items-end gap-x-2">
                        <MessageSquareText className="mb-1" size={16} />
                        Nhắn tin
                    </button>
                    <Button icon={<MoreHorizontal size={16} />} type='primary'></Button>
                </div>
            </div>
            <Divider className="my-3" />

            <ProfilePostList user={targetUser} isShowPostCreator={false} />
        </div>
    </div>
};

export default ProfileUserContent;
