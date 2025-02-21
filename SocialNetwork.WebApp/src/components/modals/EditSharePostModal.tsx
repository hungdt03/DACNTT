import { Avatar, Popover } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import TagFriendModal from "./TagFriendModal";
import { PrivacyType } from "../../enums/privacy";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { PostResource } from "../../types/post";
import { getButtonPrivacyContent } from "../../utils/post";
import { FriendResource } from "../../types/friend";


export type EditSharePostRequest = {
    content: string;
    privacy: PrivacyType;
    tagIds: string[];
    removeTagIds: string[]
}

type EditSharePostModalProps = {
    onSubmit?: (values: EditSharePostRequest) => Promise<boolean>;
    post: PostResource
}

const EditSharePostModal: FC<EditSharePostModalProps> = ({
    onSubmit,
    post
}) => {

    const { user } = useSelector(selectAuth)
    const [isEdited, setIsEdited] = useState(false)
    const [tags, setTags] = useState<FriendResource[]>([])

  
    const [postRequest, setPostRequest] = useState<EditSharePostRequest>({
        content: post.content,
        privacy: post.privacy,
        removeTagIds: [],
        tagIds: []
    });

    const handleEditSharePost = () => {
        if (onSubmit?.(postRequest)) {
            setPostRequest({
                content: '',
                privacy: PrivacyType.PUBLIC,
                removeTagIds: [],
                tagIds: []
            })
        }
    }

    useEffect(() => {
        setPostRequest({
            content: post.content,
            privacy: post.privacy,
            removeTagIds: [],
            tagIds: []
        })

        setTags([...post.tags.map(tag => tag.user)])
    }, [post])

    const handleTagsChange = (newTags: FriendResource[]) => {
        setIsEdited(true)
        setTags(newTags)
        setPostRequest({
            ...postRequest,
            tagIds: newTags.map(tag => tag.id)
        })
    }

    const handleRemoveTag = (tag: FriendResource) => {
        const findTag = post.tags.find(item => item.user.id === tag.id)

        if (findTag && !postRequest.removeTagIds.includes(findTag.id)) {
            setPostRequest({
                ...postRequest,
                removeTagIds: [...postRequest.removeTagIds, findTag.id]
            })

            setIsEdited(true)
        }
    }


    return <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
            <Avatar className="flex-shrink-0" size='large' src={user?.avatar ?? images.user} />
            <div className="flex flex-col items-start gap-y-[1px] mb-1">
                <div className="text-[15px] font-bold">
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
                    onChange={(privacy) => {
                        setIsEdited(true);
                        setPostRequest({
                            ...postRequest,
                            privacy
                        })
                    }}
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

            <div className="p-2 rounded-md border-[1px] border-gray-200 flex justify-between items-center">
                <span>Thêm vào bài viết của bạn</span>
                <div className="flex items-center gap-x-1">
                    <Popover trigger='click' placement="right" content={<TagFriendModal
                        tags={post.tags}
                        onTagRemove={handleRemoveTag}
                        onChange={handleTagsChange}
                    />} title='Gắn thẻ người khác'>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <img alt="Tag" className="w-7 h-7" src={images.tagFriend} />
                        </button>
                    </Popover>
                </div>
            </div>
        </div>

        <button onClick={handleEditSharePost} disabled={!isEdited || !postRequest.content} className="py-[5px] w-full rounded-md font-semibold text-[16px] text-white bg-sky-500">LƯU LẠI</button>

    </div>
};

export default EditSharePostModal;
