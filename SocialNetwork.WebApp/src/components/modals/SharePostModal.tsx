import { Avatar, Modal, Popover } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import TagFriendModal from "./TagFriendModal";
import useModal from "../../hooks/useModal";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { PrivacyType } from "../../constants/privacy";
import { PostResource } from "../../types/post";
import { PostType } from "../../constants/post-type";
import postService from "../../services/postService";
import { getButtonPrivacyContent } from "../../utils/post";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

export type SharePostRequest = {
    content: string;
    privacy: PrivacyType;
    postId?: string;
    originalPostId?: string;
}

type SharePostModalProps = {
    onSuccess?: (message: string) => void;
    onFailed?: (message: string) => void;
    post: PostResource
}

const SharePostModal: FC<SharePostModalProps> = ({
    onSuccess,
    onFailed,
    post
}) => {
    const { isModalOpen: openTagFriend, handleCancel: cancelTagFriend, showModal: showTagFriend, handleOk: okTagFriend } = useModal()
    const { user } = useSelector(selectAuth)

    const [postRequest, setPostRequest] = useState<SharePostRequest>({
        content: '',
        privacy: PrivacyType.PUBLIC,
    })

    useEffect(() => {
        if(post.postType === PostType.SHARE_POST) {
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

        if(response.isSuccess) {
            setPostRequest({
                ...postRequest,
                content: '',
            })
            onSuccess?.(response.message)
        } else {
            onFailed?.(response.message)
        }
    }

    return <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
            <Avatar size='large' src={images.user} />
            <div className="flex flex-col items-start gap-y-[1px] mb-1">
                <span className="text-[16px] font-semibold">{user?.fullName}</span>
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
        <div className="flex flex-col gap-y-2">
            <div className="w-full">
                <textarea value={postRequest.content} onChange={e => setPostRequest({
                    ...postRequest,
                    content: e.target.value
                })} className="text-xl outline-none border-none w-full" rows={4} placeholder="Long ơi, bạn đang nghĩ gì thế" />
            </div>
           
        </div>
        <button onClick={handleSubmit} disabled={!postRequest.content} className="py-[5px] w-full rounded-md font-semibold text-[16px] text-white bg-sky-500">Chia sẻ</button>

        <Modal title={<p className="text-center font-semibold text-xl">Gắn thẻ người khác</p>} footer={[]} open={openTagFriend} onOk={okTagFriend} onCancel={cancelTagFriend}>
            <TagFriendModal />
        </Modal>
    </div>
};

export default SharePostModal;
