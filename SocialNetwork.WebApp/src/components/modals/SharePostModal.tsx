import { Avatar, Popover } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import TagFriendModal from "./TagFriendModal";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { PrivacyType } from "../../enums/privacy";
import { PostResource } from "../../types/post";
import { PostType } from "../../enums/post-type";
import postService from "../../services/postService";
import { getButtonPrivacyContent } from "../../utils/post";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { FriendResource } from "../../types/friend";

export type SharePostRequest = {
    content: string;
    privacy: PrivacyType;
    postId?: string;
    originalPostId?: string;
    tagIds: string[]
}

type SharePostModalProps = {
    onSuccess?: (data: PostResource, message: string) => void;
    onFailed?: (message: string) => void;
    post: PostResource
}

const SharePostModal: FC<SharePostModalProps> = ({
    onSuccess,
    onFailed,
    post
}) => {
    const { user } = useSelector(selectAuth)
    const [tags, setTags] = useState<FriendResource[]>([])

    const [postRequest, setPostRequest] = useState<SharePostRequest>({
        content: '',
        privacy: PrivacyType.PUBLIC,
        tagIds: []
    })

    useEffect(() => {
        if (post.postType === PostType.SHARE_POST) {
            setPostRequest({
                ...postRequest,
                originalPostId: post.originalPostId,
                postId: post.id
            })
        } else {
            setPostRequest({
                ...postRequest,
                originalPostId: post.id,
                postId: post.id
            })
        }
    }, [post])

    const handleSubmit = async () => {
        const response = await postService.sharePost(postRequest);

        if (response.isSuccess) {
            setPostRequest({
                ...postRequest,
                content: '',
            })
            onSuccess?.(response.data, response.message)
        } else {
            onFailed?.(response.message)
        }
    }

    const handleTagsChange = (tags: FriendResource[]) => {
        setTags(tags)
        setPostRequest({
            ...postRequest,
            tagIds: tags.map(tag => tag.id)
        })
    }

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
                <div className="flex items-center gap-x-2">
                    <button className="flex items-center gap-x-1 font-semibold text-gray-700 py-[1px] px-1 bg-gray-100 rounded-md">
                        <span className="text-[12px]">Bảng feed</span>
                    </button>
                    <Popover trigger='click' content={<PostPrivacryOption
                        onChange={value => setPostRequest({
                            ...postRequest,
                            privacy: value
                        })}
                    />}>
                        {getButtonPrivacyContent(postRequest.privacy)}
                    </Popover>
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-y-2">
            <div className="w-full">
                <textarea value={postRequest.content} onChange={e => setPostRequest({
                    ...postRequest,
                    content: e.target.value
                })} className="outline-none border-none w-full sm:text-lg text-[16px]" rows={4} placeholder="Hãy nói gì đó về nội dung này ..." />
            </div>

            <div className="sm:p-2 px-2 py-1 rounded-md border-[1px] border-gray-200 flex justify-between items-center">
                <span className="sm:text-sm text-[13px]">Thêm vào bài viết của bạn</span>
                <div className="flex items-center gap-x-1">
                    <Popover trigger='click' placement="right" content={<TagFriendModal
                        onChange={handleTagsChange}
                    />} title='Gắn thẻ người khác'>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <img alt="Tag" className="sm:w-7 sm:h-7 w-6 h-6" src={images.tagFriend} />
                        </button>
                    </Popover>
                </div>
            </div>

        </div>


        <button onClick={handleSubmit} disabled={!postRequest.content} className="sm:py-[5px] py-[3px] w-full rounded-md font-semibold text-sm sm:text-[16px] text-white bg-sky-500">Chia sẻ</button>
    </div>
};

export default SharePostModal;
