import { Avatar, Popover, Tooltip, UploadFile } from "antd";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import images from "../../assets";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { Lock, User } from "lucide-react";
import UploadMultipleFile from "../uploads/UploadMultiFile";
import { PrivacyType } from "../../enums/privacy";
import { imageTypes, videoTypes } from "../../utils/file";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { PostResource } from "../../types/post";
import TagFriendModal from "./TagFriendModal";
import { FriendResource } from "../../types/friend";
import { TagResource } from "../../types/tag";


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

export type EditPostForm = {
    content: string;
    images: UploadFile[];
    videos: UploadFile[];
    privacy: PrivacyType;
    removeMedias: string[];
    tagIds: FriendResource[];
    removeTagIds: TagResource[];
}

type EditPostModalProps = {
    onSubmit?: (values: FormData) => Promise<boolean>;
    post: PostResource
}

const EditPostModal: FC<EditPostModalProps> = ({
    onSubmit,
    post
}) => {
    const [showUpload, setShowUpload] = useState(false);
    const uploadRef = useRef<{ clear: () => void }>(null);
    const { user } = useSelector(selectAuth)
    const valueUrls = useMemo(() => post.medias.map(item => item.mediaUrl), [post.medias]);
    const [isEdited, setIsEdited] = useState(false)
    const [tags, setTags] = useState<FriendResource[]>([])

    const handleReset = () => {
        uploadRef.current?.clear();
    };

    const [postRequest, setPostRequest] = useState<EditPostForm>({
        content: post.content,
        privacy: post.privacy,
        images: [],
        videos: [],
        removeMedias: [],
        tagIds: [],
        removeTagIds: []
    })

    const handleUploadFiles = (files: UploadFile[]) => {
        const imageFiles = files
            .filter(file => file.name && (imageTypes.includes(file.type as string) || (file.type as string).includes("image/")))

        const videoFiles = files
            .filter(file => file.name && (videoTypes.includes(file.type as string) || (file.type as string).includes("video/")))

        setPostRequest(prev => ({
            ...prev,
            images: imageFiles,
            videos: videoFiles
        }));

        if (!isEdited) setIsEdited(true)
    }


    const handleEditPost = () => {
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

        postRequest.removeTagIds.forEach(tag => {
            formData.append('removeTagIds', tag.id);
        });

        postRequest.removeMedias.forEach(mediaId => {
            formData.append('removeMediaIds', mediaId);
        });

        formData.append("privacy", postRequest.privacy);
        formData.append("content", postRequest.content);


        if (onSubmit?.(formData)) {
            setPostRequest({
                content: '',
                privacy: PrivacyType.PUBLIC,
                images: [],
                videos: [],
                removeMedias: [],
                tagIds: [],
                removeTagIds: []
            })

            handleReset()
        }
    }

    const handleShowUploadBtn = () => {
        setShowUpload(true)
    }

    useEffect(() => {
        if (post.medias.length > 0) {
            setShowUpload(true)
        }

        setPostRequest({
            content: post.content,
            privacy: post.privacy,
            images: [],
            videos: [],
            removeMedias: [],
            tagIds: [],
            removeTagIds: []
        })

        setTags([...post.tags.map(p => p.user)])

    }, [post])

    const handleRemoveFiles = (url?: string) => {
        const media = post.medias.find(item => item.mediaUrl === url);

        if (media) {
            setPostRequest({
                ...postRequest,
                removeMedias: [...postRequest.removeMedias, media.id]
            })
        }
    }

    const handleRemoveTag = (tag: FriendResource) => {
        const findTag = post.tags.find(item => item.user.id === tag.id)

        if(findTag && !postRequest.removeTagIds.includes(findTag)) {
            setPostRequest({
                ...postRequest,
                removeTagIds: [...postRequest.removeTagIds, findTag]
            })
        }
    }

    return <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
            <Avatar size='large' src={images.user} />
            <div className="flex flex-col items-start gap-y-[1px] mb-1">
                <div className="text-[16px] font-semibold">
                    {user?.fullName}
                    {tags.length > 0 &&
                        (() => {
                            const maxDisplay = 3;
                            const displayedTags = tags.slice(0, maxDisplay);
                            const remainingTagsCount = tags.length - maxDisplay;

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
                <textarea value={postRequest.content} onChange={e => {

                    setPostRequest({
                        ...postRequest,
                        content: e.target.value
                    })
                    if (!isEdited) setIsEdited(true)

                }} className="text-xl outline-none border-none w-full min-h-[80px] max-h-[240px] overflow-y-auto custom-scrollbar" rows={5} placeholder="Long ơi, bạn đang nghĩ gì thế" />
            </div>
            {showUpload && <UploadMultipleFile
                valueUrls={valueUrls}
                ref={uploadRef}
                onRemoveFileUrl={handleRemoveFiles}
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
                        tags={post.tags}
                        onChange={(tags) => {
                            setPostRequest({
                                ...postRequest,
                                tagIds: tags
                            })
                            setTags(tags)
                        }}
                        onTagRemove={handleRemoveTag}
                    />} title='Gắn thẻ người khác'>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <img alt="Tag" className="w-7 h-7" src={images.tagFriend} />
                        </button>
                    </Popover>
                </div>
            </div>
        </div>
        <button onClick={handleEditPost} disabled={!isEdited || !postRequest.content} className="py-[5px] w-full rounded-md font-semibold text-[16px] text-white bg-sky-500">LƯU LẠI</button>
    </div>
};

export default EditPostModal;
