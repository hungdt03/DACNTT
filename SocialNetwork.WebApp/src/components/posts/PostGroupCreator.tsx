import { Avatar, Divider, Modal } from "antd";
import { FC } from "react";
import images from "../../assets";
import useModal from "../../hooks/useModal";
import CreatePostModal from "../modals/CreatePostModal";
import postService from "../../services/postService";
import { Id, toast } from "react-toastify";
import { PostResource } from "../../types/post";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

type PostGroupCreatorProps = {
    onSuccess?: (toastId: Id, message: string, data: PostResource) => void;
    onFalied?: (toastId: Id, message: string) => void;
    groupId: string
}

const PostGroupCreator: FC<PostGroupCreatorProps> = ({
    onSuccess,
    onFalied,
    groupId
}) => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const { user } = useSelector(selectAuth)

    const handleCreatePostAsync = async (values: FormData): Promise<boolean> => {
        const toastId: Id = toast.loading('Đang tạo bài viết... Vui lòng không refresh lại trang');
        handleOk()

        try {
            values.append('groupId', groupId)
            const response = await postService.createPost(values);
            if (response.isSuccess) {
                onSuccess?.(toastId, response.message, response.data)
                return true;
            } else {
                onFalied?.(toastId, response.message)
                return false;
            }
        } catch (error) {
            onFalied?.(toastId, error as string)
            return false;
        }
    }

    return <div className="p-4 rounded-md bg-white flex flex-col gap-y-4 shadow">
        <div className="flex items-center gap-x-4">
            <Avatar className="flex-shrink-0" size='large' src={user?.avatar ?? images.user} />
            <button onClick={showModal} className="text-gray-500 py-2 px-3 rounded-xl bg-gray-50 w-full text-left">{user?.fullName?.split(' ').slice(-1)[0]} ơi, bạn đang nghĩ gì thế?</button>
        </div>
        <Divider className="my-2" />
        <div className="flex items-center gap-x-4">
            <button className="py-[6px] px-4 bg-gray-100 flex items-center gap-x-2 rounded-md text-gray-500 text-sm">
                <img alt="Ảnh" className="w-6 h-6" src={images.photo} />
                <span>Ảnh</span>
            </button>
            <button className="py-[6px] px-4 bg-gray-100 flex items-center gap-x-2 rounded-md text-gray-500 text-sm">
                <img alt="Video" className="w-6 h-6" src={images.video} />
                <span>Video</span>
            </button>
            <button className="py-[6px] px-4 bg-gray-100 flex items-center gap-x-2 rounded-md text-gray-500 text-sm">
                <img alt="Âm thanh" className="w-6 h-6" src={images.music} />
                <span> Âm thanh</span>
            </button>
        </div>

        <Modal title={<p className="text-center font-semibold text-xl">Tạo bài viết</p>} footer={[]} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <CreatePostModal
                onSubmit={handleCreatePostAsync}
            />
        </Modal>
    </div>
};

export default PostGroupCreator;
