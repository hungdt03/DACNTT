import { Divider, Empty, Image, message } from "antd";

import { FC, useState } from "react";
import images from "../../assets";
import { FriendResource } from "../../types/friend";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, setUserDetails } from "../../features/slices/auth-slice";
import BoxModifyBio from "./components/BoxModifyBio";
import userService from "../../services/userService";
import { AppDispatch } from "../../app/store";
import ProfilePersonalInfo from "./ProfilePersonalInfo";

type ProfileLeftSideProps = {
    friends: FriendResource[]
}

const ProfileLeftSide: FC<ProfileLeftSideProps> = ({
    friends
}) => {

    const { user } = useSelector(selectAuth);
    const [modifyBio, setModifyBio] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>()

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

    return <div className="flex flex-col h-full lg:overflow-y-auto lg:scrollbar-hide gap-y-4 py-4 col-span-12 lg:col-span-4">
        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-lg text-gray-700">Giới thiệu</span>

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

            {user && <ProfilePersonalInfo user={user} />}
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

export default ProfileLeftSide;
