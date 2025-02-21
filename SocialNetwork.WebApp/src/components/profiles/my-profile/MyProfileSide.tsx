import { FC, useState } from "react";
import { FriendResource } from "../../../types/friend";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, setUserDetails } from "../../../features/slices/auth-slice";
import { AppDispatch } from "../../../app/store";
import userService from "../../../services/userService";
import { Divider, Empty, Image, message } from "antd";
import BoxModifyBio from "../components/BoxModifyBio";
import images from "../../../assets";
import { Link } from "react-router-dom";
import MyPersonalInfo from "./MyPersonalInfo";
import ProfileImage from "../shared/media/ProfileImage";
import ProfileVideo from "../shared/media/ProfileVideo";

type MyProfileSideProps = {
    friends: FriendResource[]
}

const MyProfileSide: FC<MyProfileSideProps> = ({
    friends
}) => {
    const { user } = useSelector(selectAuth);
    const dispatch = useDispatch<AppDispatch>()

    const [modifyBio, setModifyBio] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleModifyBio = async (bioValue: string) => {
        setLoading(true)
        const response = await userService.modifyBio(bioValue);
        setLoading(false)
        if (response.isSuccess) {

            setModifyBio(false)

            user && dispatch(setUserDetails({
                ...user,
                bio: response.data
            }))

            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className="flex flex-col w-full lg:h-full lg:overflow-y-auto lg:scrollbar-hide gap-y-2 md:gap-y-4 py-2 md:py-4 lg:col-span-5">
        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-[15px] md:text-lg text-gray-700">Giới thiệu</span>
            <div className="flex flex-col gap-y-3">
                {modifyBio ? <BoxModifyBio
                    initialValue={user?.bio ?? ''}
                    onCancel={() => setModifyBio(false)}
                    onOk={handleModifyBio}
                    loading={loading}
                />
                    : <div className="flex flex-col gap-y-2">
                        {user?.bio && <span className="w-full text-center italic font-semibold text-sm py-1">{user.bio}</span>}
                        <button onClick={() => setModifyBio(true)} className="w-full py-2 flex justify-center rounded-md bg-sky-100 text-sm font-semibold text-primary">
                            {user?.bio ? 'Cập nhật tiểu sử' : 'Thêm tiểu sử'}
                        </button>
                    </div>}
            </div>

            <Divider className="my-0" />

            {user && <MyPersonalInfo user={user} />}
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-[15px] md:text-lg text-gray-700">Bạn bè</span>
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
                        {user?.id !== friend.id && <span className="text-xs text-gray-400">{friend.mutualFriends} bạn chung</span>}
                    </Link>
                ))}
            </div>
            {friends.length > 9 && <button className="bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</button>}
        </div>

        {user && <ProfileImage userId={user.id} isMe />}
        {user && <ProfileVideo userId={user.id} isMe />}

    </div>
};

export default MyProfileSide;
