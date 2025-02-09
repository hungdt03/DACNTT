import { Camera, CheckIcon, Upload as LucideUpload, Plus } from "lucide-react";
import { FC, useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import images from "../../../assets";
import { Avatar, Button, Divider, message, Tabs, TabsProps, Tooltip, Upload, UploadFile, UploadProps } from "antd";
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
    friends: FriendResource[]
}

const VALID_TABS = ["friends", "followers", "followees", "saved-posts", "images", "videos"];

const MyProfileContent: FC<MyProfileContentProps> = ({
    user,
    friends
}) => {

    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [coverLoading, setCoverLoading] = useState(false)
    const [tempCoverImage, setTempCoverImage] = useState<string>('')
    const [fileCoverImage, setFileCoverImage] = useState<UploadFile>();

    const { id, tab } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && tab && !VALID_TABS.includes(tab)) {
            navigate(`/profile/${id}`, { replace: true });
        }
    }, [tab, id, navigate]);

    const onAvatarChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (!isValidImage(newFileList[0] as RcFile)) {
            message.error('Vui lòng chọn file ảnh')
            return false;
        } else {
            const totalSize = (newFileList[0] as RcFile).size;
            const maxSize = 4 * 1024 * 1024;

            if (totalSize > maxSize) {
                message.error("Vui lòng chọn file ảnh tối đa 4MB");
                return false;
            }
        }

        uploadAvatar(newFileList[0])
    };

    const onCoverImageChange: UploadProps['onChange'] = async ({ file }) => {
        if (!isValidImage(file as RcFile)) {
            message.error('Vui lòng chọn file ảnh')
            return;
        } else {
            const totalSize = (file as RcFile).size;
            const maxSize = 4 * 1024 * 1024;

            if (totalSize > maxSize) {
                message.error("Vui lòng chọn file ảnh tối đa 4MB");
                return;
            }
        }

        const base64Url = await getBase64(file as RcFile);
        setTempCoverImage(base64Url);
        setFileCoverImage(file)
    };

    const uploadAvatar = async (file: UploadFile) => {
        if (file.originFileObj) {
            const formData = new FormData();
            formData.append('file', file.originFileObj, file.name);

            setLoading(true)
            const response = await userService.uploadAvatar(formData);
            setLoading(false)

            if (response.isSuccess) {
                toast.success(response.message);
                dispatch(setUserDetails(response.data))
            } else {
                toast.error(response.message)
            }
        }

    }

    const uploadCoverImage = async (file: UploadFile | undefined) => {

        if (file) {
            const formData = new FormData();
            formData.append('file', file as RcFile);

            setCoverLoading(true)
            const response = await userService.uploadCoverImage(formData);
            setCoverLoading(false)

            if (response.isSuccess) {
                toast.success(response.message);
                dispatch(setUserDetails(response.data))
                setFileCoverImage(undefined)
                setTempCoverImage('')
            } else {
                toast.error(response.message)
            }
        }

    }

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

    return <div id="my-profile-page" className="bg-transparent w-full col-span-12 lg:col-span-8 overflow-y-auto scrollbar-hide py-4">
        <div className="flex flex-col gap-y-4 overflow-y-auto bg-white p-4">
            <div className="w-full h-full relative z-10">
                <img alt="Ảnh bìa" className="w-full border-[1px] object-cover max-h-[25vh] h-full md:max-h-[30vh] rounded-lg" src={tempCoverImage || user.coverImage || images.cover} />
                <div className="flex items-center gap-x-2 absolute right-4 top-4 md:top-auto md:bottom-4 shadow">
                    <Upload
                        beforeUpload={() => false}
                        showUploadList={false}
                        onChange={onCoverImageChange}
                        multiple={false}
                        className="cursor-pointer w-full"
                        disabled={loading}
                    >
                        <button disabled={coverLoading} className="shadow bg-white text-primary flex items-center gap-x-2 px-3 py-2 rounded-md cursor-pointer">
                            <LucideUpload size={18} />
                            <span className="text-sm font-semibold">
                                {tempCoverImage ? 'Chọn ảnh khác' : 'Thêm ảnh bìa'}
                            </span>
                        </button>
                    </Upload>
                    {tempCoverImage && <Button loading={coverLoading} onClick={() => uploadCoverImage(fileCoverImage)} type="primary" className="cursor-pointer" icon={<CheckIcon />}>
                        Lưu lại
                    </Button>}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-end -mt-20 gap-x-6 lg:-mt-12 px-8">
                <div className="relative z-30 flex-shrink-0">
                    {user?.haveStory ?
                        <Link className="lg:w-32 lg:h-32 w-28 h-28 rounded-full border-[3px] p-[2px] border-primary flex items-center justify-center aspect-square" to={`/stories/${user.id}`}>
                            <img alt="Ảnh đại diện" className="object-cover" src={user?.avatar ?? images.user} />
                        </Link>
                        : <img
                            alt="Ảnh đại diện"
                            className="lg:w-32 lg:h-32 w-28 h-28 rounded-full z-30 object-cover"
                            src={user?.avatar ?? images.user}
                        />
                    }

                    {user?.isOnline && <div className="absolute bottom-2 right-3 p-2 rounded-full border-[2px] border-white bg-green-500"></div>}
                    <ImgCrop modalOk="Lưu lại" modalCancel="Hủy bỏ" modalTitle="Ảnh đại diện" showGrid showReset resetText="Bắt đầu lại" rotationSlider>
                        <Upload
                            multiple={false}
                            maxCount={1}
                            beforeUpload={(_) => false}
                            showUploadList={false}
                            onChange={onAvatarChange}
                            className="cursor-pointer absolute bottom-0 right-0 p-1 bg-white border-primary border-[1px] w-8 h-8 flex items-center justify-center rounded-full"
                        >
                            <Camera className="text-primary" size={18} />
                        </Upload>
                    </ImgCrop>

                </div>
                <div className="lg:py-6 py-3 flex flex-col lg:flex-row items-center gap-y-4 lg:gap-y-0 lg:items-end justify-between w-full">
                    <div className="flex flex-col items-center lg:items-start gap-y-1">
                        <span className="font-bold text-2xl">{user?.fullName}</span>
                        <div className="flex items-center gap-x-3">
                            <span className="text-gray-500">{user?.friendCount} người bạn</span>
                            <div className="bg-primary w-2 h-2 rounded-full"></div>
                            <span className="font-semibold text-gray-500">{user?.followingCount} đang theo dõi</span>
                            <div className="bg-primary w-2 h-2 rounded-full"></div>
                            <span className="font-semibold text-gray-500">{user?.followerCount} theo dõi</span>
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
                    <Link to='/stories/create'>
                        <Button icon={<Plus size={16} />} type='primary'>Thêm vào tin</Button>
                    </Link>
                </div>
            </div>
            <Divider className="my-3" />
            <Tabs defaultActiveKey="" activeKey={tab} onChange={handleTabChange} className="bg-white p-4 rounded-lg" items={items} />
            {loading && <Loading />}

        </div>
    </div >
};

export default MyProfileContent;
