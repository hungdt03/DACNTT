import { Camera, CheckIcon, Upload as LucideUpload, Plus } from "lucide-react";
import { FC, useState } from "react";
import ImgCrop from 'antd-img-crop';
import images from "../../assets";
import { Avatar, Button, Divider, Tooltip, Upload, UploadFile, UploadProps } from "antd";
import ProfilePostList from "./ProfilePostList";
import { FriendResource } from "../../types/friend";
import { UserResource } from "../../types/user";
import { getBase64 } from "../../utils/file";
import userService from "../../services/userService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setUserDetails } from "../../features/slices/auth-slice";
import Loading from "../Loading";
import { RcFile } from "antd/es/upload";
import { Link } from "react-router-dom";

type ProfileContentProps = {
    user: UserResource;
    friends: FriendResource[]
}

const ProfileContent: FC<ProfileContentProps> = ({
    user,
    friends
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [tempCoverImage, setTempCoverImage] = useState<string>('')
    const [fileCoverImage, setFileCoverImage] = useState<UploadFile>()

    const onAvatarChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        uploadAvatar(newFileList[0])
    };

    const onCoverImageChange: UploadProps['onChange'] = async ({ file }) => {
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

            setLoading(true)
            const response = await userService.uploadCoverImage(formData);
            setLoading(false)

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


    return <div className="bg-transparent w-full col-span-12 lg:col-span-8 overflow-y-auto scrollbar-hide py-4">
        <div className="flex flex-col gap-y-4 overflow-y-auto shadow">
            <div className="w-full h-full relative z-10">
                <img alt="Ảnh bìa" className="w-full object-cover max-h-[25vh] h-full md:max-h-[30vh] rounded-lg" src={tempCoverImage || user.coverImage || images.cover} />
                <div className="flex items-center gap-x-2 absolute right-4 top-4 md:top-auto md:bottom-4 shadow">
                    <Upload
                        beforeUpload={() => false}
                        showUploadList={false}
                        onChange={onCoverImageChange}
                        multiple={false}
                        className="cursor-pointer w-full"
                        disabled={loading}
                    >
                        <div className="shadow bg-sky-50 text-primary flex items-center gap-x-2 px-3 py-2 rounded-md cursor-pointer">
                            <LucideUpload size={18} />
                            <span className="text-sm font-semibold">
                                {tempCoverImage ? 'Chọn ảnh khác' : 'Thêm ảnh bìa'}
                            </span>
                        </div>
                    </Upload>
                    {tempCoverImage && <Button loading={loading} onClick={() => uploadCoverImage(fileCoverImage)} type="primary" className="cursor-pointer" icon={<CheckIcon />}>
                        Lưu lại
                    </Button>}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-end -mt-20 gap-x-6 lg:-mt-12 px-8">
                <div className="relative z-30 flex-shrink-0">
                    <img alt="Ảnh đại diện" className="lg:w-32 lg:h-32 w-28 h-28 rounded-full border-[1px] border-primary object-cover" src={user?.avatar} />
                    <ImgCrop modalOk="Lưu lại" modalCancel="Hủy bỏ" modalTitle="Ảnh đại diện" showGrid showReset resetText="Bắt đầu lại" rotationSlider>
                        <Upload
                            multiple={false}
                            maxCount={1}
                            beforeUpload={() => false}
                            showUploadList={false}
                            onChange={onAvatarChange}
                            className="cursor-pointer absolute bottom-0 right-0 p-1 bg-sky-50 border-primary border-[1px] w-8 h-8 flex items-center justify-center rounded-full"
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
                    <Link to='/story/create'>
                        <Button icon={<Plus size={16} />} type='primary'>Thêm vào tin</Button>
                    </Link>
                </div>
            </div>
            <Divider className="my-3" />
            <ProfilePostList user={user} />
            {loading && <Loading />}
        </div>
    </div>
};

export default ProfileContent;
