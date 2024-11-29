import { FC } from "react";
import useModal from "../../hooks/useModal";
import { Avatar, Divider, Image, Modal, Popover, Tooltip } from "antd";
import images from "../../assets";
import Post, { PostMoreAction, PostReaction } from "./Post";
import { HeartIcon, MoreHorizontal, SendHorizonal, ShareIcon } from "lucide-react";
import { svgReaction } from "../../assets/svg";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import PostReactionModal from "../modals/PostReactionModal";
import PostModal from "../modals/PostModal";
import SharePostModal from "../modals/SharePostModal";
import PostShareInner from "./PostShareInner";
import BoxSendComment from "../BoxSendComment";


const SharePost: FC = () => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const { handleCancel: cancelReactionModal, isModalOpen: openReactionModal, handleOk: okReactionModal, showModal: showReactionModal } = useModal();
    const { handleCancel: cancelSharePost, isModalOpen: openSharePost, handleOk: okSharePost, showModal: showSharePost } = useModal();

    return <div className="flex flex-col gap-y-3 p-4 bg-white rounded-md shadow">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <Avatar className="w-10 h-10" src={images.user} />
                <div className="flex flex-col gap-y-[1px]">
                    <span className="font-semibold text-[16px] text-gray-600">Bùi Văn Yên</span>
                    <div className="flex items-center gap-x-2">
                        <Tooltip title='Thứ bảy, 23 tháng 11, 2014 lúc 19:17'>
                            <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">35 phút trước</span>
                        </Tooltip>
                        <Tooltip title='Công khai'>
                            <button className="mb-[2px]">
                                <img className="w-3 h-3" src={images.earth} alt="Public" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <Popover content={<PostMoreAction />}>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <MoreHorizontal className="text-gray-400" />
                </button>
            </Popover>
        </div>

        <div className="flex flex-col gap-y-3">
            <p className="text-sm text-gray-700">Các cao nhân IT chỉ cách cứu dùm em, ổ C của lap em đang bị đỏ mặc dù đã xóa bớt đi mấy file không dùng. Giờ em phải làm sao cho nó về bth lại đây ạ :(((. Cao nhân chỉ điểm giúp em với</p>
            <PostShareInner />
        </div>
        <div className="flex items-center justify-between text-sm">
            <button onClick={showReactionModal} className="flex gap-x-[2px] items-center">
                <Avatar.Group>
                    <img src={svgReaction.like} className="w-5 h-5 mx-[5px]" />
                    <img src={svgReaction.love} className="w-5 h-5 mx-[5px]" />
                    <img src={svgReaction.care} className="w-5 h-5 mx-[5px]" />
                </Avatar.Group>
                <span className="hover:underline">112</span>
            </button>
            <div className="flex gap-x-4 items-center">
                <button className="hover:underline text-gray-500">17 bình luận</button>
                <button className="hover:underline text-gray-500">17 lượt chia sẻ</button>
            </div>
        </div>
        <Divider className='my-0' />
        <div className="flex items-center justify-between gap-x-4">
            <Popover content={<PostReaction />}>
                <button className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                    <HeartIcon className="h-5 w-5 text-gray-500" />
                    <span>Thích</span>
                </button>
            </Popover>
            <button onClick={showModal} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-500" />
                <span>Bình luận</span>
            </button>
            <button onClick={showSharePost} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ShareIcon className="h-5 w-5 text-gray-500" />
                <span>Chia sẻ</span>
            </button>
        </div>
        <Divider className='mt-0 mb-2' />
        <BoxSendComment />

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Bài viết của Bùi Việt</p>} width='700px' footer={[
            <BoxSendComment />
        ]} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <PostModal />
        </Modal>

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Cảm xúc bài viết</p>} width='600px' footer={[]} open={openReactionModal} onOk={okReactionModal} onCancel={cancelReactionModal}>
            <PostReactionModal />
        </Modal>


        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Chia sẻ bài viết</p>} footer={[]} open={openSharePost} onOk={okSharePost} onCancel={cancelSharePost}>
            <SharePostModal />
        </Modal>
    </div>
};

export default SharePost;
