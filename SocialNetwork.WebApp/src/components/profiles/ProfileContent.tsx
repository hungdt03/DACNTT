import { Upload } from "lucide-react";
import { FC, useState } from "react";
import { selectAuth } from "../../features/slices/auth-slice";
import { useSelector } from "react-redux";
import images from "../../assets";
import { Divider } from "antd";
import ProfilePostList from "./ProfilePostList";
import { FriendResource } from "../../types/friend";
import { UserResource } from "../../types/user";

type ProfileContentProps = {
    user: UserResource
}

const ProfileContent: FC<ProfileContentProps> = ({
    user
}) => {
    const [friends, setFriends] = useState<FriendResource[]>([])

    return <div className="bg-transparent w-full col-span-12 lg:col-span-8 overflow-y-auto scrollbar-hide py-4">
        <div className="flex flex-col gap-y-4 overflow-y-auto shadow">
            <div className="w-full h-full relative z-10">
                <img alt="Ảnh bìa" className="w-full object-cover max-h-[25vh] h-full md:max-h-[30vh] rounded-lg" src={images.cover} />
                <div className="absolute right-4 top-4 md:top-auto md:bottom-4 shadow bg-sky-50 text-primary flex items-center gap-x-2 px-3 py-2 rounded-md cursor-pointer">
                    <Upload size={18} />
                    <span className="text-sm font-semibold">Thêm ảnh bìa</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-end -mt-20 gap-x-6 lg:-mt-12 px-8">
                <img alt="Ảnh đại diện" className="lg:w-32 lg:h-32 w-28 h-28 rounded-full border-[1px] border-primary z-30" src={user?.avatar ?? images.user} />
                <div className="lg:py-6 py-3 flex flex-col lg:flex-row items-center gap-y-4 lg:gap-y-0 lg:items-end justify-between w-full">
                    <div className="flex flex-col items-center lg:items-start gap-y-1">
                        <span className="font-bold text-2xl">{user?.fullName}</span>
                        <div className="flex items-center gap-x-3">
                            <span className="text-gray-500">{user?.friendCount} người bạn</span>
                            <div className="bg-primary w-2 h-2 rounded-full"></div>
                            <span className="font-semibold text-gray-500">{user?.followingCount} người theo dõi</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-end">
              
            </div>
            <Divider className="my-3" />

            <ProfilePostList user={user} />
        </div>
    </div>
};

export default ProfileContent;
