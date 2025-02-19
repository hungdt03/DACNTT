import { FC } from "react";
import images from "../../../assets";
import { Divider } from "antd";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { Link } from "react-router-dom";

const MainLeftSidebar: FC = () => {
    const { user } = useSelector(selectAuth);

    return <div className="col-span-3 hidden xl:block h-full py-4 overflow-y-hidden scrollbar-hide">
        <div className="relative flex flex-col rounded-md h-[90%]">
            <div className="flex flex-col sticky top-0">
                <div className="flex flex-col gap-y-3 items-center">
                    <div className="w-full flex flex-col items-center">
                        <img alt="Ảnh bìa" className="w-full h-[100px] object-cover" src={user?.coverImage ?? images.cover} />
                        <div className="relative">
                            {
                                user?.haveStory ? <Link className="h-[50px] w-[50px] inline-block p-[1px] rounded-full border-[4px] border-primary -mt-[25px]" to={`/stories/${user?.id}`}>
                                    <img alt="Avatar" className="w-full h-full object-cover flex-shrink-0 rounded-full" src={user?.avatar ?? images.user} />
                                </Link>
                                    :
                                    <img alt="Avatar" className="h-[50px] w-[50px] object-cover flex-shrink-0 rounded-full -mt-[25px]" src={user?.avatar ?? images.user} />
                            }

                            <div className="absolute bottom-1 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-[17px]">{user?.fullName}</span>
                        <p className="text-gray-400 text-sm">{user?.bio}</p>
                    </div>
                </div>
                <div className="p-4 w-full">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold">{user?.friendCount}</span>
                            <span className="text-xs text-gray-400">bạn bè</span>
                        </div>
                        <Divider className="h-10 text-gray-500" type="vertical" />
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold">{user?.followerCount}</span>
                            <span className="text-xs text-gray-400">người theo dõi</span>
                        </div>
                        <Divider className="h-10 text-gray-500" type="vertical" />
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold">{user?.followingCount}</span>
                            <span className="text-xs text-gray-400">đang theo dõi</span>
                        </div>
                    </div>
                </div>
            </div>
            <Divider className="my-0" />
            <div className="p-4 flex flex-col gap-y-1 h-full overflow-y-auto scrollbar-hide">
                <Link to={`/profile/${user?.id}`} className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img alt="Trang cá nhân" className="w-8 h-8" src={images.userProfile} />
                    <span className="text-[15px] font-semibold text-gray-500">Trang cá nhân</span>
                </Link>
                <Link to={`/profile/${user?.id}/saved-posts`} className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img alt="Bảng tin" className="w-8 h-8" src={images.feed} />
                    <span className="text-[15px] font-semibold text-gray-500">Bài viết đã lưu</span>
                </Link>
                <Link to={`/profile/${user?.id}/friends`} className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img alt="Bạn bè" className="w-8 h-8" src={images.friend} />
                    <span className="text-[15px] font-semibold text-gray-500">Bạn bè</span>
                </Link>
                <Link to={`/profile/${user?.id}/followers`} className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img alt="Người theo dõi" className="w-8 h-8" src={images.follower} />
                    <span className="text-[15px] font-semibold text-gray-500">Người theo dõi</span>
                </Link>
                <Link to={`/profile/${user?.id}/followees`} className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img alt="Đang theo dõi" className="w-8 h-8" src={images.followee} />
                    <span className="text-[15px] font-semibold text-gray-500">Đang theo dõi</span>
                </Link>
                <Link to='/groups' className="flex items-center gap-x-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <img alt="Nhóm" className="w-8 h-8" src={images.group} />
                    <span className="text-[15px] font-semibold text-gray-500">Nhóm</span>
                </Link>

            </div>
        </div>
    </div>
};

export default MainLeftSidebar;
