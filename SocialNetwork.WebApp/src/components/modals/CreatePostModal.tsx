import { Avatar, Popover, Tooltip, UploadFile } from "antd";
import { FC, useRef, useState } from "react";
import images from "../../assets";
import UploadMultipleFile from "../uploads/UploadMultiFile";
import TagFriendModal from "./TagFriendModal";
import { PrivacyType } from "../../enums/privacy";
import { imageTypes, videoTypes } from "../../utils/file";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { getButtonPrivacyContent } from "../../utils/post";
import { FriendResource } from "../../types/friend";


export type PostForm = {
    content: string;
    images: UploadFile[];
    videos: UploadFile[];
    privacy: PrivacyType;
    tagIds: FriendResource[]
}

type CreatePostModalProps = {
    onSubmit?: (values: FormData) => Promise<boolean>
}

const CreatePostModal: FC<CreatePostModalProps> = ({
    onSubmit
}) => {
    const [showUpload, setShowUpload] = useState(false);
    const uploadRef = useRef<{ clear: () => void }>(null);
    const { user } = useSelector(selectAuth)

    const handleReset = () => {
        uploadRef.current?.clear();
    };

    const [postRequest, setPostRequest] = useState<PostForm>({
        content: '',
        privacy: PrivacyType.PUBLIC,
        images: [],
        videos: [],
        tagIds: []
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

        postRequest.tagIds.forEach(tag => {
            formData.append('tagIds', tag.id);
        });


        formData.append("privacy", postRequest.privacy);
        formData.append("content", postRequest.content);

        if (onSubmit?.(formData)) {
            setPostRequest({
                content: '',
                privacy: PrivacyType.PUBLIC,
                images: [],
                videos: [],
                tagIds: []
            })

            handleReset()
        }
    }

    const handleShowUploadBtn = () => {
        setShowUpload(true)
    }

    return <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
            <Avatar className="flex-shrink-0" size='large' src={images.user} />
            <div className="flex flex-col items-start gap-y-[1px] mb-1">
                <div className="text-[16px] font-semibold">
                    {user?.fullName}
                    {postRequest.tagIds.length > 0 &&
                        (() => {
                            const maxDisplay = 3; 
                            const displayedTags = postRequest.tagIds.slice(0, maxDisplay);
                            const remainingTagsCount = postRequest.tagIds.length - maxDisplay;

                            return (
                                <>
                                    {' cùng với '}
                                    {displayedTags.map((tag, index) => (
                                        <span key={tag.id}>
                                            {tag.fullName}
                                            {index < displayedTags.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                    {remainingTagsCount > 0 && ` và ${remainingTagsCount} người khác`}
                                </>
                            );
                        })()}
                </div>
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
                    <Popover trigger='click' placement="right" content={<TagFriendModal
                        onChange={(tags) => setPostRequest({
                            ...postRequest,
                            tagIds: tags
                        })}
                    />} title='Gắn thẻ người khác'>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <img alt="Tag" className="w-7 h-7" src={images.tagFriend} />
                        </button>
                    </Popover>
                </div>
            </div>
        </div>
        <button onClick={handleCreatePost} disabled={!postRequest.content} className="py-[5px] w-full rounded-md font-semibold text-[16px] text-white bg-sky-500">Đăng</button>

    </div>
};

export default CreatePostModal;
