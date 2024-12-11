import { Image } from "antd";
import { Home, LocateIcon, School, Wifi } from "lucide-react";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { FriendResource } from "../../types/friend";
import friendService from "../../services/friendService";
import { UserResource } from "../../types/user";
import { Link } from "react-router-dom";

type ProfileLeftSideProps = {
    user: UserResource
}

const ProfileLeftSide: FC<ProfileLeftSideProps> = ({
    user
}) => {
    const [friends, setFriends] = useState<FriendResource[]>([])

    const fetchFriends = async () => {
        const response = await friendService.getTopSixOfUserFriends(user.id);
        if(response.isSuccess) {
            setFriends(response.data)
        }
    }

    useEffect(() => {
        fetchFriends()
    }, [user])
    return <div className="flex flex-col h-full lg:overflow-y-auto lg:scrollbar-hide gap-y-4 py-4 col-span-12 lg:col-span-4">
        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-2">
            <span className="font-bold text-lg text-gray-700">Giới thiệu</span>

            <div className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-3">
                    <School size={20} />
                    <div className="flex items-center">
                        <span>Học Kĩ thuật phần mềm tại Đại học Tôn Đức Thắng</span>
                    </div>
                </div>
                <div className="flex items-center gap-x-3">
                    <Home size={20} />
                    <div className="flex items-center">
                        <span>Sống tại Thành phố Hồ Chí Minh</span>
                    </div>
                </div>
                <div className="flex items-center gap-x-3">
                    <LocateIcon size={20} />
                    <div className="flex items-center">
                        <span>Đến từ Bà Rịa Vũng Tàu, Việt Nam</span>
                    </div>
                </div>
                <div className="flex items-center gap-x-3">
                    <Wifi size={20} />
                    <div className="flex items-center">
                        <span>Có 254 người theo dõi</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-700">Bạn bè</span>
                {/* <Link className="text-primary" to="/friends">Xem tất cả bạn bè</Link> */}
            </div>

            <div className="grid grid-cols-3 gap-2">
                {friends.map(friend => <div className="flex flex-col items-start gap-1" key={friend.id}>
                    <Image preview={false} src={friend.avatar ?? images.cover} className="border-[1px] border-primary rounded-md" />
                    <Link to={`/profile/${friend.id}`} className="text-sm font-semibold">{friend.fullName}</Link>
                </div>)}
              
            </div>

            <button className="bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</button>
        </div>

    </div>
};

export default ProfileLeftSide;
