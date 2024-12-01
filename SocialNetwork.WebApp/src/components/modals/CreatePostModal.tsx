import { Avatar, Modal, Popover, Radio, Tooltip, UploadFile, UploadProps } from "antd";
import { FC, useRef, useState } from "react";
import images from "../../assets";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { Lock, User, Users } from "lucide-react";
import UploadMultipleFile from "../uploads/UploadMultiFile";
import useModal from "../../hooks/useModal";
import TagFriendModal from "./TagFriendModal";
import { PrivacyType } from "../../constants/privacy";
import { imageTypes, videoTypes } from "../../utils/file";


type PostPrivacryOptionProps = {
    onChange?: (privacy: PrivacyType) => void
}

export const PostPrivacryOption: FC<PostPrivacryOptionProps> = ({
    onChange
}) => {

    const [privacy, setPrivacy] = useState<string>(PrivacyType.PUBLIC);

    const handleChangePrivacy = (privacy: PrivacyType) => {
        setPrivacy(privacy)
        onChange?.(privacy)
    }

    return <div className="flex flex-col gap-y-2">
        <Radio.Group value={privacy} onChange={(e) => handleChangePrivacy(e.target.value)}>
            <div className="flex items-center justify-between gap-x-6 px-2 py-1 rounded-md hover:bg-gray-100">
                <div className="flex items-center gap-x-2">
                    <div className="w-12 h-12 flex items-center justify-center p-3 rounded-full bg-sky-100">
                        <img className="w-5 h-5" src={images.earth} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[18px]">Công khai</span>
                        <p className="text-gray-500">Bất kì ai ở trên hoặc ngoài Facebook</p>
                    </div>
                </div>
                <Radio name="privacy" value={PrivacyType.PUBLIC} />
            </div>
            <div className="flex items-center justify-between gap-x-6 px-2 py-1 rounded-md hover:bg-gray-100">
                <div className="flex items-center gap-x-2">
                    <div className="w-12 h-12 flex items-center justify-center p-3 rounded-full bg-sky-100">
                        <Users size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[18px]">Bạn bè</span>
                        <p className="text-gray-500">Bạn bè của bạn, bất kì ai được gắn thẻ và bạn bè của họ</p>
                    </div>
                </div>
                <Radio name="privacy" value={PrivacyType.FRIENDS} />
            </div>
            <div className="flex items-center justify-between gap-x-6 px-2 py-1 rounded-md hover:bg-gray-100">
                <div className="flex items-center gap-x-2">
                    <div className="w-12 h-12 flex items-center justify-center p-3 rounded-full bg-sky-100">
                        <User size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[18px]">Chỉ mình tôi</span>
                        <p className="text-gray-500">Chỉ mình bạn mới thấy bài viết này</p>
                    </div>
                </div>
                <Radio name="privacy" value={PrivacyType.PRIVATE} />
            </div>
        </Radio.Group>
    </div>
}


const renderButtonContent = (icon: JSX.Element, label: string, imageSrc?: string) => (
    <button className="flex items-center gap-x-2 font-semibold text-gray-700 py-[1px] px-2 bg-gray-100 rounded-sm">
        {imageSrc ? <img className="w-3 h-3" src={imageSrc} alt={label} /> : icon}
        <span className="text-[13px]">{label}</span>
        <FontAwesomeIcon icon={faCaretDown} />
    </button>
);

const getButtonPrivacyContent = (privacy: PrivacyType) => {
    switch (privacy) {
        case PrivacyType.PRIVATE:
            return renderButtonContent(<Lock size={14} />, 'Chỉ mình tôi');
        case PrivacyType.FRIENDS:
            return renderButtonContent(<User size={14} />, 'Bạn bè');
        case PrivacyType.PUBLIC:
        default:
            return renderButtonContent(<img className="w-3 h-3" src={images.earth} alt="Công khai" />, 'Công khai', images.earth);
    }
};

export type PostForm = {
    content: string;
    images: UploadFile[];
    videos: UploadFile[];
    privacy: PrivacyType
}

type CreatePostModalProps = {
    onSubmit?: (values: FormData) => Promise<boolean>
}

const CreatePostModal: FC<CreatePostModalProps> = ({
    onSubmit
}) => {
    const [showUpload, setShowUpload] = useState(false);
    const { isModalOpen: openTagFriend, handleCancel: cancelTagFriend, showModal: showTagFriend, handleOk: okTagFriend } = useModal();
    const uploadRef = useRef<{ clear: () => void }>(null);

    const handleReset = () => {
        uploadRef.current?.clear();
    };

    const [postRequest, setPostRequest] = useState<PostForm>({
        content: '',
        privacy: PrivacyType.PUBLIC,
        images: [],
        videos: []
    })

    const handleUploadFiles = (files: UploadFile[]) => {
        const imageFiles = files
            .filter(file => imageTypes.includes(file.type as string) || (file.type as string).includes("image/"))

        const videoFiles = files
            .filter(file => videoTypes.includes(file.type as string) || (file.type as string).includes("video/"))

        setPostRequest(prev => ({
            ...prev,
            images: imageFiles,
            videos: videoFiles
        }));

    }


    const handleCreatePost = () => {
        const formData = new FormData();

        postRequest.images.forEach(file => {
            if (file.originFileObj) {
                formData.append('images', file.originFileObj, file.name);
            }
        });

        postRequest.videos.forEach(file => {
            if (file.originFileObj) {
                formData.append('videos', file.originFileObj, file.name);
            }
        });


        formData.append("privacy", postRequest.privacy);
        formData.append("content", postRequest.content);

        if (onSubmit?.(formData)) {
            setPostRequest({
                content: '',
                privacy: PrivacyType.PUBLIC,
                images: [],
                videos: []
            })

            handleReset()
        }
    }

    const handleShowUploadBtn = () => {
        setShowUpload(true)
    }

    return <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
            <Avatar size='large' src={images.user} />
            <div className="flex flex-col items-start gap-y-[1px] mb-1">
                <span className="text-[16px] font-semibold">Nguyễn Lâm Thành Long</span>
                <Popover trigger='click' content={<PostPrivacryOption
                    onChange={(privacy) => setPostRequest({
                        ...postRequest,
                        privacy
                    })}
                />}>
                    {getButtonPrivacyContent(postRequest.privacy)}
                </Popover>
            </div>
        </div>
        <div className="flex flex-col gap-y-2">
            <div className="w-full">
                <textarea value={postRequest.content} onChange={e => setPostRequest({
                    ...postRequest,
                    content: e.target.value
                })} className="text-xl outline-none border-none w-full min-h-[80px] max-h-[240px] overflow-y-auto custom-scrollbar" rows={5} placeholder="Long ơi, bạn đang nghĩ gì thế" />
            </div>
            {showUpload && <UploadMultipleFile
                ref={uploadRef}
                onChange={handleUploadFiles}
            />}
            <div className="p-2 rounded-md border-[1px] border-gray-200 flex justify-between items-center">
                <span>Thêm vào bài viết của bạn</span>
                <div className="flex items-center gap-x-1">
                    <Tooltip title='Ảnh/video'>
                        <button onClick={handleShowUploadBtn} className="p-2 rounded-full hover:bg-gray-100">
                            <img className="w-6 h-6" src={images.photo} />
                        </button>
                    </Tooltip>
                    <Tooltip title='Gắn thẻ người khác'>
                        <button onClick={showTagFriend} className="p-2 rounded-full hover:bg-gray-100">
                            <img className="w-7 h-7" src={images.tagFriend} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
        <button onClick={handleCreatePost} disabled={!postRequest.content} className="py-[5px] w-full rounded-md font-semibold text-[16px] text-white bg-sky-500">Đăng</button>

        <Modal title={<p className="text-center font-semibold text-xl">Gắn thẻ người khác</p>} footer={[]} open={openTagFriend} onOk={okTagFriend} onCancel={cancelTagFriend}>
            <TagFriendModal />
        </Modal>
    </div>
};

export default CreatePostModal;
