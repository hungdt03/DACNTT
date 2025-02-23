import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "../../../services/adminService";
import { Divider, Tabs } from "antd";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { formatDateStandard } from "../../../utils/date";
import adminImages from "../../../assets/adminImage";
import UserFriendTabs from "./UserFriendTabs";
import { UserResource } from "../../../types/user";
import images from "../../../assets";
import UserFollowerTabs from "./UserFollowerTabs";
import UserFolloweeTabs from "./UserFolloweeTabs";
import UserPostTabs from "./UserPostTabs";

const UserDetailPage: FC = () => {
    const [user, setUser] = useState<UserResource>()
    const { userId } = useParams();

    const fetchUser = async () => {
        if (userId) {
            const response = await adminService.getUserById(userId);
            if (response.isSuccess) {
                setUser(response.data)
            }
        }
    }

    useEffect(() => {
        fetchUser()
    }, [userId])

    return <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
            <div className="grid grid-cols-4 gap-4">
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={images.friend} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{user?.friendCount}</span>
                        <span>Bạn bè</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={adminImages.post} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{user?.postCount}</span>
                        <span>Bài viết</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={50} src={images.follower} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{user?.followerCount}</span>
                        <span>Người theo dõi</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={images.followee} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{user?.followingCount}</span>
                        <span>Đang theo dõi</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-y-4 col-span-4 shadow bg-white rounded-md p-4">
            <div className="flex flex-col">
                <img
                    style={{
                        aspectRatio: 3 / 1
                    }}
                    className="object-cover rounded-md"
                    src={user?.coverImage}
                />

                <div className="-mt-5 flex justify-center">
                    <img  className="w-16 rounded-full h-16 object-cover border-1" src={user?.avatar} />
                </div>
            </div>

            <div className="flex flex-col items-center gap-y-2">
                <span className="text-xl font-bold">{user?.fullName}</span>
                <p className="text-sm text-gray-600 line-clamp-3">{user?.bio ?? 'Chưa cập nhật'}</p>
            </div>
            <Divider className="my-0" />
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Ngày tham gia</span>
                    <span className="text-sm text-gray-600">{formatDateStandard(new Date(user?.dateJoined!))}</span>
                </div>
            </div>
        </div>

        <div className="col-span-8 bg-white p-4 rounded-md shadow">
            <Tabs
                items={[
                    {
                        key: 'posts',
                        label: 'Bài viết',
                        children: userId ? <UserPostTabs userId={userId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    },
                    {
                        key: 'friends',
                        label: 'Bạn bè',
                        children: userId ? <UserFriendTabs userId={userId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    },
                    {
                        key: 'followers',
                        label: 'Người theo dõi',
                        children: userId ? <UserFollowerTabs userId={userId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    },
                    {
                        key: 'followees',
                        label: 'Đang theo dõi',
                        children: userId ? <UserFolloweeTabs userId={userId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    }
                ]}
            />
        </div>

    </div>
};

export default UserDetailPage;
