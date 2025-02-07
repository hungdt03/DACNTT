import { FC } from "react";
import { FriendResource } from "../../../types/friend";
import { Divider, Empty, Image } from "antd";
import images from "../../../assets";
import { Link } from "react-router-dom";
import { UserResource } from "../../../types/user";
import UserPersonalInfo from "./UserPersonalInfo";

type UserProfileSideProps = {
    friends: FriendResource[];
    user: UserResource
}

const UserProfileSide: FC<UserProfileSideProps> = ({
    friends,
    user
}) => {
    return <div className="flex flex-col h-full lg:overflow-y-auto lg:scrollbar-hide gap-y-4 py-4 col-span-12 lg:col-span-4">
        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-lg text-gray-700">Giới thiệu</span>
            {user?.bio && <span className="w-full text-center italic font-semibold text-sm py-0">{user.bio}</span>}
            <Divider className="my-0" />
            {user && <UserPersonalInfo user={user} />}
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-lg text-gray-700">Bạn bè</span>

            {friends.length === 0 ? <div className="w-full h-full flex items-center justify-center py-2">
                <Empty description='Chưa có bạn bè nào' />
            </div> :
                <div className="grid grid-cols-3 gap-2">
                {friends.map(friend => (
                    <Link to={`/profile/${friend.id}`} key={friend.id} className="flex flex-col items-start gap-1 cursor-pointer">
                        <Image
                            preview={false}
                            src={friend.avatar ?? images.cover}
                            style={{ height: '100%', width: '100%' }}
                            className="border-[1px] w-full h-full object-cover border-primary rounded-md"
                        />
                        <span className="text-sm font-semibold line-clamp-1">{friend.fullName}</span>
                        {user?.id !== friend.id && <span className="text-xs text-gray-400">{friend.mutualFriends} bạn chung</span>}
                    </Link>
                ))}
            </div>            
            }

            {friends.length > 9 && <button className="bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</button>}

        </div>

    </div>
};

export default UserProfileSide;
