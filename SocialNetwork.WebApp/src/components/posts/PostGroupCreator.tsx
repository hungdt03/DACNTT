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
import { GroupResource } from "../../types/group";

type PostGroupCreatorProps = {
    onSuccess?: (toastId: Id, message: string, data: PostResource) => void;
    onFalied?: (toastId: Id, message: string) => void;
    group: GroupResource
}

const PostGroupCreator: FC<PostGroupCreatorProps> = ({
    onSuccess,
    onFalied,
    group
}) => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const { user } = useSelector(selectAuth)

    const handleCreatePostAsync = async (values: FormData): Promise<boolean> => {
        const toastId: Id = toast.loading('Đang tạo bài viết... Vui lòng không refresh lại trang');
        handleOk()

        try {
            values.append('groupId', group.id);

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
            <Avatar className="flex-shrink-0 w-[25px] h-[25px] md:w-[40px] md:h-[40px]" src={user?.avatar ?? images.user} />
            <button onClick={showModal} className="text-gray-500 py-2 px-3 text-[14px] md:text-sm lg:text-[16px] rounded-xl bg-gray-50 w-full text-left">Bạn đang nghĩ gì thế?</button>
        </div>
        <Divider className="my-2" />

        <Modal title={<p className="text-center font-bold text-lg">Tạo bài viết</p>} classNames={{
            footer: 'hidden'
        }} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <CreatePostModal
                group={group}
                onSubmit={handleCreatePostAsync}
            />
        </Modal>
    </div>
};

export default PostGroupCreator;
