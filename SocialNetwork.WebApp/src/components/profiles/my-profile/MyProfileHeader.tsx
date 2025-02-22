import { Camera, CheckIcon, Upload as LucideUpload, Plus } from "lucide-react";
import { FC, useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import images from "../../../assets";
import { Avatar, Button,  message, Modal, Tooltip, Upload, UploadFile, UploadProps } from "antd";
import { FriendResource } from "../../../types/friend";
import { UserResource } from "../../../types/user";
import { getBase64, isValidImage } from "../../../utils/file";
import userService from "../../../services/userService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setUserDetails } from "../../../features/slices/auth-slice";
import { RcFile } from "antd/es/upload";
import { Link, useNavigate, useParams } from "react-router-dom";
import useModal from "../../../hooks/useModal";
import UpdateUserInfoModal from "../../modals/UpdateUserInfoModal";
import { VALID_TABS } from "./MyProfileContent";
import Loading from "../../Loading";

type MyProfileHeaderProps = {
    user: UserResource;
    friends: FriendResource[]
}


const MyProfileHeader: FC<MyProfileHeaderProps> = ({
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
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()

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

    return <div className="xl:max-w-screen-lg z-10 lg:max-w-screen-lg lg:px-0 md:max-w-screen-md max-w-screen-sm px-2 mx-auto w-full bg-white pb-6">
        <div className="w-full h-full relative">
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
        <div className="flex flex-col lg:flex-row items-center lg:items-end md:ml-10 ml-0 -mt-16 gap-x-6 lg:-mt-8 px-8">
            <div className="relative z-30 flex-shrink-0">
                {user?.haveStory ?
                    <Link className="lg:w-32 lg:h-32 w-28 h-28 rounded-full border-[4px] p-[2px] border-primary flex items-center justify-center aspect-square" to={`/stories/${user.id}`}>
                        <img alt="Ảnh đại diện" className="object-cover w-full h-full rounded-full" src={user?.avatar ?? images.user} />
                    </Link>
                    : <img
                        alt="Ảnh đại diện"
                        className="lg:w-32 lg:h-32 w-28 h-28 rounded-full z-30 object-cover"
                        src={user?.avatar ?? images.user}
                    />
                }

                <div className="absolute bottom-0 right-8 p-2 rounded-full border-[2px] border-white bg-green-500"></div>
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
            <div className="lg:py-6 py-3 flex md:mt-10 flex-col lg:flex-row items-center gap-y-4 lg:gap-y-0 lg:items-end justify-between w-full">
                <div className="flex flex-col items-center lg:items-start gap-y-1">
                    <span className="font-bold text-2xl">{user?.fullName}</span>
                    <div className="flex items-center flex-wrap justify-center gap-x-3 gap-y-2 text-sm md:text-[15px]">
                        <span className="font-semibold text-gray-500">{user?.friendCount} người bạn</span>
                        <div className="bg-primary w-2 h-2 rounded-full"></div>
                        <span className="font-semibold text-gray-500">{user?.followingCount} đang theo dõi</span>
                        <div className="bg-primary w-2 h-2 rounded-full"></div>
                        <span className="font-semibold text-gray-500">{user?.followerCount} theo dõi</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full flex md:flex-row flex-col-reverse gap-y-4 md:justify-between">
            <Avatar.Group>
                {friends.map(friend => <Tooltip key={friend.id} title={friend.fullName}>
                    <Avatar src={friend.avatar} />
                </Tooltip>)}
            </Avatar.Group>
            <div className="flex items-center justify-center gap-x-2">
                <Button onClick={showModal} icon={<Plus size={16} />} type='primary'>Thông tin cá nhân</Button>
                <Link to='/stories/create'>
                    <Button icon={<Plus size={16} />} type='primary'>Thêm vào tin</Button>
                </Link>
            </div>
        </div>

        
        <Modal
            style={{ top: 50 }}
            title={<p className="text-center font-bold text-[16px]">Cập nhật thông tin cá nhân</p>}
            width='500px'
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            classNames={{
                footer: 'hidden'
            }}
        >
            <UpdateUserInfoModal
                onSuccess={handleOk}
                user={user}
            />
        </Modal>

        {loading && <Loading />}

    </div>
};

export default MyProfileHeader;
