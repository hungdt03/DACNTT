import { Camera, CheckIcon, Upload as LucideUpload, Plus } from "lucide-react";
import { FC, useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import images from "../../../assets";
import { Avatar, Button, Divider, message, Modal, Tabs, TabsProps, Tooltip, Upload, UploadFile, UploadProps } from "antd";
import ProfilePostList from "../shared/ProfilePostList";
import { FriendResource } from "../../../types/friend";
import { UserResource } from "../../../types/user";
import { getBase64, isValidImage } from "../../../utils/file";
import userService from "../../../services/userService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setUserDetails } from "../../../features/slices/auth-slice";
import Loading from "../../Loading";
import { RcFile } from "antd/es/upload";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProfileFriendList from "../shared/ProfileFriendList";
import ProfileFollowerList from "../shared/ProfileFollowerList";
import ProfileFolloweeList from "../shared/ProfileFolloweesList";
import ProfileSavedPost from "../shared/ProfileSavedPost";
import ProfileImageList from "../shared/ProfileImageList";
import ProfileVideoList from "../shared/ProfileVideoList";

type MyProfileContentProps = {
    user: UserResource;
}

export const VALID_TABS = ["friends", "followers", "followees", "saved-posts", "images", "videos"];

const MyProfileContent: FC<MyProfileContentProps> = ({
    user,
}) => {

    const { id, tab } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && tab && !VALID_TABS.includes(tab)) {
            navigate(`/profile/${id}`, { replace: true });
        }

    }, [tab, id, navigate]);


    const items: TabsProps['items'] = [
        {
            key: '',
            label: 'Bài viết',
            children: <ProfilePostList user={user} />,
        },
        {
            key: 'friends',
            label: 'Bạn bè',
            children: <ProfileFriendList userId={user.id} />,
        },
        {
            key: 'images',
            label: 'Ảnh',
            children: <ProfileImageList userId={user.id} isMe={true} />,
        },
        {
            key: 'videos',
            label: 'Video',
            children: <ProfileVideoList userId={user.id} isMe={true} />,
        },
        {
            key: 'followers',
            label: 'Người theo dõi',
            children: <ProfileFollowerList userId={user.id} />,
        },
        {
            key: 'followees',
            label: 'Đang theo dõi',
            children: <ProfileFolloweeList userId={user.id} />,
        },
        {
            key: 'saved-posts',
            label: 'Bài viết đã lưu',
            children: <ProfileSavedPost />,
        },
    ];

    const handleTabChange = (key: string) => {
        navigate(`/profile/${id}/${key}`);
    };


    return <div id="my-profile-page" className="bg-transparent w-full lg:h-full lg:overflow-y-auto lg:scrollbar-hide lg:col-span-7 py-2 md:py-4">
        <Tabs defaultActiveKey="" activeKey={tab} onChange={handleTabChange} className="p-4 h-full rounded-lg bg-white" items={items} />
    </div >
};

export default MyProfileContent;
