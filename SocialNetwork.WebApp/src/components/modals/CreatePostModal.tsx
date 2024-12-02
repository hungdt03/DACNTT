import { Avatar, Modal, Popover, Tooltip, UploadFile } from "antd";
import { FC, useRef, useState } from "react";
import images from "../../assets";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { Lock, User } from "lucide-react";
import UploadMultipleFile from "../uploads/UploadMultiFile";
import useModal from "../../hooks/useModal";
import TagFriendModal from "./TagFriendModal";
import { PrivacyType } from "../../constants/privacy";
import { imageTypes, videoTypes } from "../../utils/file";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { getButtonPrivacyContent } from "../../utils/post";


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
    const { user } = useSelector(selectAuth)

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
                <span className="text-[16px] font-semibold">{user?.fullName}</span>
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
                            <img alt="Ảnh" className="w-6 h-6" src={images.photo} />
                        </button>
                    </Tooltip>
                    <Tooltip title='Gắn thẻ người khác'>
                        <button onClick={showTagFriend} className="p-2 rounded-full hover:bg-gray-100">
                            <img alt="Tag" className="w-7 h-7" src={images.tagFriend} />
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
