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
import cn from "../../utils/cn";
import BackgroundPostOption from "./BackgroundPostOption";


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
    background?: string;
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

    const [isLongText, setIsLongText] = useState(false)
    const [isUseBackground, setIsUseBackground] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

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
        removeTagIds: [],
        background: post.background
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

        if (postRequest.background) {
            formData.append('background', postRequest.background);
        }

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
                removeTagIds: [],
                background: ''
            })

            handleReset()
        }
    }

    const handleShowUploadBtn = () => {
        setShowUpload(!showUpload)
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
            removeTagIds: [],
            background: post.background
        })

        setTags([...post.tags.map(p => p.user)])

        if (contentRef.current) {
            contentRef.current.innerHTML = post.content
        }

    }, [post]);

    const handleContentChange = (content: string) => {
        setIsEdited(true)
        if (content.trim().length > 120) {
            setIsLongText(true)
        } else {
            setIsLongText(false)
        }

        setPostRequest({
            ...postRequest,
            content: content
        })
    }


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

        if (findTag && !postRequest.removeTagIds.includes(findTag)) {
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
                <div className="text-[15px] font-semibold">
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
        <div className="flex flex-col gap-y-4">
            <div className="relative w-full flex justify-center">
                <div className={cn("relative items-center justify-center w-full h-[380px] rounded-md px-6 py-8", postRequest.background ? 'flex' : 'hidden')} style={{
                    background: postRequest.background
                }} >
                    <div
                        ref={contentRef}
                        onInput={(e) => {
                            const value = e.currentTarget.innerText.trim();
                            let isUseBackground = true;
                            if (value.length > 300) {
                                isUseBackground = false
                            }
                            setPostRequest({
                                ...postRequest,
                                content: value,
                                background: isUseBackground ? postRequest.background : undefined
                            })
                            setIsEdited(true)
                        }}
                        contentEditable
                        aria-placeholder="Hưng ơi, bạn đang nghĩ gì thế"
                        className="text-2xl font-bold editable-div bg-transparent text-center w-full outline-none border-none text-white break-words break-all"
                    ></div>

                </div>
                {!postRequest.background && <textarea ref={textareaRef} value={postRequest.content} rows={showUpload ? 5 : 8} onChange={e => handleContentChange(e.target.value)} className={cn("outline-none border-none w-full h-full overflow-y-auto custom-scrollbar p-2", isLongText ? 'text-[16px]' : 'text-xl')} placeholder="Long ơi, bạn đang nghĩ gì thế" />}
            </div>
            {showUpload && <div className="flex flex-col">
                <UploadMultipleFile
                    valueUrls={valueUrls}
                    ref={uploadRef}
                    onRemoveFileUrl={handleRemoveFiles}
                    onChange={handleUploadFiles}
                />
                 <span className="text-sm italic">(Tối đa 50MB)</span>
            </div>}
            <div className="p-2 rounded-md border-[1px] border-gray-200 flex justify-between items-center">
                <span>Thêm vào bài viết của bạn</span>
                <div className="flex items-center gap-x-1">
                    <Tooltip title='Phông nền'>
                        <Popover trigger='click' content={<BackgroundPostOption
                            onChange={background => {
                                if (background) {
                                    if (contentRef.current) contentRef.current.innerText = postRequest.content;
                                    setShowUpload(false)
                                }

                                if (!background && textareaRef.current) {
                                    textareaRef.current.focus()
                                }

                                setPostRequest({
                                    ...postRequest,
                                    background: background
                                })

                                setIsEdited(true)
                            }}
                        />}>
                            <button className={cn((postRequest.images.length > 0 || postRequest.videos.length > 0 || postRequest.removeMedias.length < post.medias.length || postRequest.content.trim().length > 120) && 'cursor-not-allowed')} disabled={postRequest.images.length > 0 || postRequest.videos.length > 0 || postRequest.removeMedias.length < post.medias.length || postRequest.content.trim().length > 120} onClick={() => setIsUseBackground(!isUseBackground)}>
                                <img width={30} height={30} src={images.AaBackground} />
                            </button>
                        </Popover>
                    </Tooltip>
                    <Tooltip title='Ảnh/video'>
                        <button disabled={!!postRequest.background || postRequest.images.length > 0 || postRequest.videos.length > 0} onClick={handleShowUploadBtn} className={cn("p-2 rounded-full hover:bg-gray-100", (!!postRequest.background || postRequest.images.length > 0 || postRequest.videos.length > 0) && 'cursor-not-allowed')}>
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
