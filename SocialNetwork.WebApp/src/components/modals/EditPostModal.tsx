import { Avatar, Popover, Tooltip, UploadFile } from "antd";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import images from "../../assets";
import UploadMultipleFile, { UploadFileBinding } from "../uploads/UploadMultiFile";
import { PrivacyType } from "../../enums/privacy";
import { isValidImage, isValidVideo } from "../../utils/file";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { PostResource } from "../../types/post";
import TagFriendModal from "./TagFriendModal";
import { FriendResource } from "../../types/friend";
import { TagResource } from "../../types/tag";
import cn from "../../utils/cn";
import BackgroundPostOption from "./BackgroundPostOption";
import { getButtonPrivacyContent, getGroupButtonPrivacyContent } from "../../utils/post";
import data from '@emoji-mart/data'; // Dữ liệu emoji được bundled
import Picker from '@emoji-mart/react';
import { Laugh } from "lucide-react";


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

    const valueUrls = useMemo(() => post.medias.map(item => ({
        url: item.mediaUrl,
        type: item.mediaType
    } as UploadFileBinding)), [post.medias]);

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
        const imageFiles = files.filter(file => file.originFileObj && isValidImage(file.originFileObj));
        const videoFiles = files.filter(file => file.originFileObj && isValidVideo(file.originFileObj));

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
            setIsEdited(true)
            setPostRequest({
                ...postRequest,
                removeTagIds: [...postRequest.removeTagIds, findTag]
            })
        }
    }

    const handleEmojiSelect = (emoji: { native: string }) => {
        setIsEdited(true)
        setPostRequest({
            ...postRequest,
            content: postRequest.content + emoji.native
        })
    };

    return <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
            <Avatar className="flex-shrink-0 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]" src={user?.avatar ?? images.user} />
            <div className="flex flex-col items-start gap-y-[1px] mb-1">
                <div className="text-[14px] font-semibold text-gray-700">
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
                {post.isGroupPost ? getGroupButtonPrivacyContent(post.group.privacy) : <Popover trigger='click' content={<PostPrivacryOption
                    onChange={(privacy) => {
                        setIsEdited(true);
                        setPostRequest({
                            ...postRequest,
                            privacy
                        })
                    }}
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
                        className="sm:text-2xl text-lg font-bold editable-div bg-transparent text-center w-full outline-none border-none text-white break-words break-all"
                    ></div>

                </div>
                {!postRequest.background && <textarea ref={textareaRef} value={postRequest.content} rows={showUpload ? 3 : 5} onChange={e => handleContentChange(e.target.value)} className={cn("outline-none border-none w-full h-full overflow-y-auto custom-scrollbar p-2", isLongText ? 'text-[16px]' : 'text-xl')} placeholder="Long ơi, bạn đang nghĩ gì thế" />}
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
            <div className="sm:p-2 px-2 py-1 rounded-md border-[1px] border-gray-200 flex justify-between items-center">
                <span className="sm:text-sm text-[13px]">Thêm vào bài viết của bạn</span>
                <div className="flex items-center gap-x-1">
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
                                <img className="sm:w-[30px] sm:h-[30xp] w-[25px] h-[25px] object-cover" src={images.AaBackground} />
                            </button>
                        </Popover>
                    </Tooltip>
                    <Tooltip title='Ảnh/video'>
                        <button disabled={!!postRequest.background || postRequest.images.length > 0 || postRequest.videos.length > 0} onClick={handleShowUploadBtn} className={cn("p-2 rounded-full hover:bg-gray-100", (!!postRequest.background || postRequest.images.length > 0 || postRequest.videos.length > 0) && 'cursor-not-allowed')}>
                            <img alt="Ảnh" className="sm:w-6 sm:h-6 w-[22px] h-[22px]" src={images.photo} />
                        </button>
                    </Tooltip>
                    <Popover trigger='click' placement="right" content={<TagFriendModal
                        tags={post.tags}
                        onChange={(tags) => {
                            setIsEdited(true)
                            setPostRequest({
                                ...postRequest,
                                tagIds: tags
                            })
                            setTags(tags)
                        }}
                        onTagRemove={handleRemoveTag}
                    />} title='Gắn thẻ người khác'>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <img alt="Tag" className="sm:w-7 sm:h-7 w-6 h-6" src={images.tagFriend} />
                        </button>
                    </Popover>
                </div>
            </div>
        </div>
        <button onClick={handleEditPost} disabled={!isEdited || !postRequest.content} className="sm:py-[8px] py-[4px] w-full rounded-md font-semibold text-sm sm:text-[16px] text-white bg-sky-500">LƯU LẠI</button>
    </div>
};

export default EditPostModal;
