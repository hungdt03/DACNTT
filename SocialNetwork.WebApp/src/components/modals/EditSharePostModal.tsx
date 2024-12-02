import { Avatar, Modal, Popover, Tooltip } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import images from "../../assets";
import useModal from "../../hooks/useModal";
import TagFriendModal from "./TagFriendModal";
import { PrivacyType } from "../../constants/privacy";
import { PostPrivacryOption } from "../posts/PostPrivacryOption";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { PostResource } from "../../types/post";
import { getButtonPrivacyContent } from "../../utils/post";



export type EditSharePostRequest = {
    content: string;
    privacy: PrivacyType;
}

type EditSharePostModalProps = {
    onSubmit?: (values: EditSharePostRequest) => Promise<boolean>;
    post: PostResource
}

const EditSharePostModal: FC<EditSharePostModalProps> = ({
    onSubmit,
    post
}) => {
    const { isModalOpen: openTagFriend, handleCancel: cancelTagFriend, showModal: showTagFriend, handleOk: okTagFriend } = useModal();
    const uploadRef = useRef<{ clear: () => void }>(null);
    const { user } = useSelector(selectAuth)
    const [isEdited, setIsEdited] = useState(false)

    const handleReset = () => {
        uploadRef.current?.clear();
    };

    const [postRequest, setPostRequest] = useState<EditSharePostRequest>({
        content: post.content,
        privacy: post.privacy,

    })

    const handleEditSharePost = () => {
        if (onSubmit?.(postRequest)) {
            setPostRequest({
                content: '',
                privacy: PrivacyType.PUBLIC,
            })

            handleReset()
        }
    }

    useEffect(() => {
        setPostRequest({
            content: post.content,
            privacy: post.privacy,
        })

    }, [post])


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
                    <Tooltip title='Gắn thẻ người khác'>
                        <button onClick={showTagFriend} className="p-2 rounded-full hover:bg-gray-100">
                            <img alt="Tag" className="w-7 h-7" src={images.tagFriend} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
        <button onClick={handleEditSharePost} disabled={!isEdited || !postRequest.content} className="py-[5px] w-full rounded-md font-semibold text-[16px] text-white bg-sky-500">LƯU LẠI</button>

        <Modal title={<p className="text-center font-semibold text-xl">Gắn thẻ người khác</p>} footer={[]} open={openTagFriend} onOk={okTagFriend} onCancel={cancelTagFriend}>
            <TagFriendModal />
        </Modal>
    </div>
};

export default EditSharePostModal;
