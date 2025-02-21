import { FC } from "react";
import { FriendResource } from "../../../types/friend";
import { Divider, Empty, Image } from "antd";
import images from "../../../assets";
import { Link } from "react-router-dom";
import { UserResource } from "../../../types/user";
import UserPersonalInfo from "./UserPersonalInfo";
import ProfileImage from "../shared/media/ProfileImage";
import ProfileVideo from "../shared/media/ProfileVideo";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";

type UserProfileSideProps = {
    friends: FriendResource[];
    user: UserResource
}

const UserProfileSide: FC<UserProfileSideProps> = ({
    friends,
    user
}) => {
    const { user: currentUser } = useSelector(selectAuth)
    return <div className="flex flex-col lg:h-full lg:overflow-y-auto lg:scrollbar-hide gap-y-2 md:gap-y-4 py-4 lg:col-span-5">
        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-[15px] md:text-lg text-gray-700">Giới thiệu</span>
            {user?.bio && <span className="w-full text-center italic font-semibold text-sm py-0">{user.bio}</span>}
            <Divider className="my-0" />
            {user && <UserPersonalInfo user={user} />}
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-[15px] md:text-lg text-gray-700">Bạn bè</span>

            {
                <div className="grid grid-cols-3 gap-2">
                    {friends.map(friend => (
                        <Link to={`/profile/${friend.id}`} key={friend.id} className="flex flex-col items-start gap-1 cursor-pointer w-full h-full">
                            <div className="relative w-full h-full">
                                <img
                                    src={friend.avatar ?? images.cover}
                                    className="border-[1px] w-full h-full object-cover border-gray-200 rounded-md aspect-square"
                                />
                                {(friend.isOnline || friend.id === user?.id) && <div className="absolute bottom-0 -right-1 p-2 rounded-full border-[2px] border-white bg-green-500"></div>}
                            </div>
                            <span className="text-sm font-semibold line-clamp-1">{friend.fullName}</span>
                            {currentUser?.id !== friend.id && <span className="text-xs text-gray-400">{friend.mutualFriends} bạn chung</span>}
                        </Link>
                    ))}
                </div>
            }

            {friends.length > 9 && <button className="bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</button>}

        </div>

        <ProfileImage userId={user.id} isMe={false} />
        <ProfileVideo userId={user.id} isMe={false} />

    </div>
};

export default UserProfileSide;
