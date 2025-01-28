import { Check, MessageSquareText, MoreHorizontal, Plus, User, UserCheckIcon, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { selectAuth } from "../../features/slices/auth-slice";
import { useSelector } from "react-redux";
import images from "../../assets";
import { Avatar, Button, Divider, Popover, Tabs, TabsProps, Tooltip, message } from "antd";
import ProfilePostList from "./ProfilePostList";
import { FriendRequestResource } from "../../types/friendRequest";
import { UserResource } from "../../types/user";
import friendRequestService from "../../services/friendRequestService";
import { toast } from "react-toastify";
import friendService from "../../services/friendService";
import { FriendRequestStatus } from "../../enums/friend-request";
import followService from "../../services/followService";
import { FriendResource } from "../../types/friend";
import ProfileFriendList from "./shared/ProfileFriendList";
import ProfileFollowerList from "./shared/ProfileFollowerList";
import ProfileFolloweeList from "./shared/ProfileFolloweesList";

type ProfileUserContentProps = {
    user: UserResource;
    friends: FriendResource[]
    friendRequest: FriendRequestResource | null;
    onRefresh?: () => void
}

const ProfileUserContent: FC<ProfileUserContentProps> = ({
    user: targetUser,
    friends,
    friendRequest,
    onRefresh
}) => {
    const { user } = useSelector(selectAuth);
    const [isFollow, setIsFollow] = useState(false);
    const [activeKey, setActiveKey] = useState<string>('1');

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

    useEffect(() => {
        const checkIsFollow = async () => {
            const response = await followService.checkFollowUser(targetUser.id);
            if (response.isSuccess) setIsFollow(true)
            else setIsFollow(false)
        }

        checkIsFollow()
    }, [targetUser])

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Bài viết',
            children: <ProfilePostList user={targetUser} isShowPostCreator={false} />,
        },
        {
            key: '2',
            label: 'Bạn bè',
            children: <ProfileFriendList userId={targetUser.id} />,
        },
        {
            key: '3',
            label: 'Người theo dõi',
            children: <ProfileFollowerList userId={targetUser.id} />,
        },
        {
            key: '4',
            label: 'Đang theo dõi',
            children: <ProfileFolloweeList userId={targetUser.id} />,
        },
        {
            key: '5',
            label: 'Bài viết đã lưu',
            children: 'Content of Tab Pane 3',
        },
    ];


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
                            <span className="text-gray-500">{targetUser?.friendCount} người bạn</span>
                            <div className="bg-primary w-2 h-2 rounded-full"></div>
                            <span className="font-semibold text-gray-500">{targetUser?.followingCount} đang theo dõi</span>
                            <div className="bg-primary w-2 h-2 rounded-full"></div>
                            <span className="font-semibold text-gray-500">{targetUser?.followerCount} theo dõi</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-between">
                <Avatar.Group>
                    {friends.map(friend => <Tooltip key={friend.id} title={friend.fullName}>
                        <Avatar src={friend.avatar} />
                    </Tooltip>)}
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

                    {(!friendRequest || friendRequest.status === FriendRequestStatus.NONE) && <Button onClick={handleSendFriendRequest} icon={<Plus size={16} />} type='primary'>Thêm bạn bè</Button>}

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

                    <Button type="primary" icon={<MessageSquareText className="mb-1" size={16} />}>
                        Nhắn tin
                    </Button>

                </div>
            </div>
            <Divider className="my-3" />
            <Tabs onChange={(key) => setActiveKey(key)} activeKey={activeKey} className="bg-white p-4 rounded-lg" items={items} />
        </div>
    </div>
};

export default ProfileUserContent;
