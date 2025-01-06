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


import cn from "../../utils/cn";
import BackgroundPostOption from "./BackgroundPostOption";


export type PostForm = {
    content: string;
    images: UploadFile[];
    videos: UploadFile[];
    privacy: PrivacyType;
    tagIds: FriendResource[];
    background?: string
}

type CreatePostModalProps = {
    onSubmit?: (values: FormData) => Promise<boolean>
}

const CreatePostModal: FC<CreatePostModalProps> = ({
    onSubmit
}) => {
    const [showUpload, setShowUpload] = useState(false);
    const uploadRef = useRef<{ clear: () => void }>(null);
    const [isLongText, setIsLongText] = useState(false)
    const [isUseBackground, setIsUseBackground] = useState(false)
    const { user } = useSelector(selectAuth);
    const contentRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)


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

    const handleContentChange = (content: string) => {
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

        if (postRequest.background) {
            formData.append("background", postRequest.background);
        }

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
        setShowUpload(!showUpload)
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
                        }}
                        contentEditable
                        aria-placeholder="Hưng ơi, bạn đang nghĩ gì thế"
                        className="text-2xl font-bold editable-div bg-transparent text-center w-full outline-none border-none text-white break-words break-all"
                    ></div>

                </div>
                {!postRequest.background && <textarea ref={textareaRef} value={postRequest.content} rows={showUpload ? 3 : 5} onChange={e => handleContentChange(e.target.value)} className={cn("outline-none border-none w-full h-full overflow-y-auto custom-scrollbar p-2", isLongText ? 'text-[16px]' : 'text-xl')} placeholder="Long ơi, bạn đang nghĩ gì thế" />}
            </div>
            {showUpload && <UploadMultipleFile
                ref={uploadRef}
                onChange={handleUploadFiles}
            />}
            <div className="p-2 rounded-md border-[1px] border-gray-200 flex justify-between items-center">
                <span>Thêm vào bài viết của bạn</span>
                <div className="flex items-center gap-x-1">
                    <Tooltip title='Phông nền'>
                        <Popover trigger='click' content={<BackgroundPostOption
                            onChange={background => {
                                if (contentRef.current && background) {
                                    contentRef.current.innerText = postRequest.content;
                                } 
                                
                                if(!background && textareaRef.current) {
                                    textareaRef.current.focus()
                                }

                                setPostRequest({
                                    ...postRequest,
                                    background: background
                                })
                            }}
                        />}>
                            <button disabled={postRequest.images.length > 0 || postRequest.videos.length > 0} onClick={() => setIsUseBackground(!isUseBackground)}>
                                <img width={30} height={30} src={images.AaBackground} />
                            </button>
                        </Popover>
                    </Tooltip>
                    <Tooltip title='Ảnh/video'>
                        <button disabled={!!postRequest.background || postRequest.images.length > 0 || postRequest.videos.length > 0} onClick={handleShowUploadBtn} className="p-2 rounded-full hover:bg-gray-100">
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
