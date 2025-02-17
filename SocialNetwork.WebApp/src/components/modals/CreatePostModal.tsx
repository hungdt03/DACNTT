import { Avatar, Popover, Tooltip, UploadFile } from "antd";
import { FC, useRef, useState } from "react";
import images from "../../assets";
import UploadMultipleFile from "../uploads/UploadMultiFile";
import TagFriendModal from "./TagFriendModal";
import { PrivacyType } from "../../enums/privacy";
import { isValidImage, isValidVideo } from "../../utils/file";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { getButtonPrivacyContent, getGroupButtonPrivacyContent } from "../../utils/post";
import { FriendResource } from "../../types/friend";


import cn from "../../utils/cn";
import BackgroundPostOption from "./BackgroundPostOption";
import { GroupResource } from "../../types/group";
import data from '@emoji-mart/data'; // Dữ liệu emoji được bundled
import Picker from '@emoji-mart/react';
import { Laugh } from "lucide-react";


export type PostForm = {
    content: string;
    images: UploadFile[];
    videos: UploadFile[];
    privacy: PrivacyType;
    tagIds: FriendResource[];
    background?: string
}

type CreatePostModalProps = {
    onSubmit?: (values: FormData) => Promise<boolean>;
    group?: GroupResource
}

const CreatePostModal: FC<CreatePostModalProps> = ({
    onSubmit,
    group
}) => {
    const [showUpload, setShowUpload] = useState(false);
    const uploadRef = useRef<{ clear: () => void }>(null);
    const [isLongText, setIsLongText] = useState(false)
    const [isUseBackground, setIsUseBackground] = useState(false)
    const { user } = useSelector(selectAuth);
    const contentRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [finishTag, setFinishTag] = useState(false);

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
        const imageFiles = files.filter(file => file.originFileObj && isValidImage(file.originFileObj));
        const videoFiles = files.filter(file => file.originFileObj && isValidVideo(file.originFileObj));

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


    const handleEmojiSelect = (emoji: { native: string }) => {
        setPostRequest({
            ...postRequest,
            content: postRequest.content + emoji.native
        })
    };

    const handleShowUploadBtn = () => {
        setShowUpload(!showUpload)
    }

    return <div className="flex flex-col gap-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-x-2">
            <Avatar className="flex-shrink-0 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]" src={user?.avatar ?? images.user} />
            <div className="flex flex-col items-start gap-y-[1px] mb-1">
                <div className="text-[14px] font-semibold text-gray-700">
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
                {group ? getGroupButtonPrivacyContent(group.privacy) : <Popover trigger='click' content={<PostPrivacryOption
                    onChange={(privacy) => setPostRequest({
                        ...postRequest,
                        privacy
                    })}
                />}>
                    {getButtonPrivacyContent(postRequest.privacy)}
                </Popover>}
            </div>
        </div>
        <div className="flex flex-col gap-y-4">
            <div className="relative w-full flex justify-center">
                <div className={cn("relative items-center justify-center w-full h-[260px] sm:h-[320px] rounded-md px-6 py-8", postRequest.background ? 'flex' : 'hidden')} style={{
                    background: postRequest.background
                }} >
                    <div
                        ref={contentRef}
                        onInput={(e) => {
                            const value = e.currentTarget.innerText.trim();
                            let isUseBackground = true;
                            if (value.length > 200) {
                                isUseBackground = false
                            }
                            setPostRequest({
                                ...postRequest,
                                content: value,
                                background: isUseBackground ? postRequest.background : undefined
                            })
                        }}
                        contentEditable
                        aria-placeholder="Bạn đang nghĩ gì thế"
                        className="sm:text-2xl text-lg font-bold editable-div bg-transparent text-center w-full outline-none border-none text-white break-words break-all"
                    ></div>

                </div>
                {!postRequest.background && <textarea ref={textareaRef} value={postRequest.content} rows={showUpload ? 3 : 5} onChange={e => handleContentChange(e.target.value)} className={cn("outline-none border-none w-full max-h-[400px] overflow-y-auto custom-scrollbar p-2", isLongText ? 'sm:text-[16px] text-[14px]' : 'sm:text-xl text-lg')} placeholder="Bạn đang nghĩ gì thế" />}
            </div>
            {showUpload && <div className="flex flex-col">
                <UploadMultipleFile
                    ref={uploadRef}
                    onChange={handleUploadFiles}
                />
                <span className="text-sm italic">(Tối đa 50MB)</span>
            </div>}
            <div className="sm:p-2 px-2 py-1 rounded-md border-[1px] border-gray-200 flex justify-between items-center">
                <span className="sm:text-sm text-[13px]">Thêm vào bài viết của bạn</span>
                <div className="flex items-center sm:gap-x-1">

                    <Tooltip title='Emoji'>
                        <Popover content={<Picker onEmojiSelect={handleEmojiSelect} theme='light' data={data} />} trigger={'click'}>
                            <button className="p-1 rounded-full cursor-pointer">
                                <Laugh strokeWidth={2} className="text-orange-400" size={26} />
                            </button>
                        </Popover>
                    </Tooltip>

                    <Tooltip title='Phông nền'>
                        <Popover trigger='click' content={<BackgroundPostOption
                            onChange={background => {
                                if (contentRef.current && background) {
                                    contentRef.current.innerText = postRequest.content;
                                }

                                if (!background && textareaRef.current) {
                                    textareaRef.current.focus()
                                }

                                setPostRequest({
                                    ...postRequest,
                                    background: background
                                })
                            }}
                        />}>
                            <button className={cn(postRequest.images.length > 0 || postRequest.videos.length > 0 || postRequest.content.trim().length > 200 && 'cursor-not-allowed')} disabled={postRequest.images.length > 0 || postRequest.videos.length > 0 || postRequest.content.trim().length > 200} onClick={() => {
                                if(!isUseBackground) {
                                    setShowUpload(false)
                                }
                                setIsUseBackground(!isUseBackground)
                            }}>
                                <img className="sm:w-[30px] sm:h-[30xp] object-cover w-[25px] h-[25px]" src={images.AaBackground} />
                            </button>
                        </Popover>
                    </Tooltip>
                    <Tooltip title='Ảnh/video'>
                        <button disabled={!!postRequest.background || postRequest.images.length > 0 || postRequest.videos.length > 0} onClick={handleShowUploadBtn} className={cn("p-2 rounded-full hover:bg-gray-100", (!!postRequest.background || postRequest.images.length > 0 || postRequest.videos.length > 0) && 'cursor-not-allowed')}>
                            <img alt="Ảnh" className="sm:w-6 sm:h-6 w-[22px] h-[22px]" src={images.photo} />
                        </button>
                    </Tooltip>
                    <Popover trigger='click' placement="right" open={finishTag} content={<TagFriendModal
                        onFinish={() => setFinishTag(false)}
                        onChange={(tags) => setPostRequest({
                            ...postRequest,
                            tagIds: tags
                        })}
                    />} title='Gắn thẻ người khác'>
                        <button onClick={() => setFinishTag(!finishTag)} className="p-2 rounded-full hover:bg-gray-100">
                            <img alt="Tag" className="sm:w-7 sm:h-7 w-6 h-6" src={images.tagFriend} />
                        </button>
                    </Popover>
                </div>
            </div>
        </div>
        <button onClick={handleCreatePost} disabled={!postRequest.content} className="sm:py-[8px] py-[3px] w-full rounded-md font-semibold text-sm sm:text-[16px] text-white bg-sky-500">Đăng</button>

    </div>
};

export default CreatePostModal;
