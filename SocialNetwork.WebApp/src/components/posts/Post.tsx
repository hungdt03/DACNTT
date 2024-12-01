import { Avatar, Divider, Modal, Popover, Tooltip, message } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";
import images from "../../assets";
import { Bookmark, Edit, Lock, MoreHorizontal, User } from "lucide-react";
import { ChatBubbleLeftIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import { svgReaction } from "../../assets/svg";
import PostModal from "../modals/PostModal";
import useModal from "../../hooks/useModal";
import PostReactionModal from "../modals/PostReactionModal";
import SharePostModal from "../modals/SharePostModal";
import PostMedia from "./PostMedia";
import BoxSendComment, { BoxCommentType } from "../BoxSendComment";
import { PostResource } from "../../types/post";
import { formatTime } from "../../utils/date";
import { PostReaction } from "./PostReaction";
import { PrivacyType } from "../../constants/privacy";
import commentService from "../../services/commentService";
import { ReactionType } from "../../constants/reaction";
import reactionService from "../../services/reactionService";
import { ReactionResource } from "../../types/reaction";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

export const PostMoreAction: FC = () => {
    return <div className="flex flex-col items-start rounded-md">
        <button className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Edit size={17} className="text-gray-500" />
            Chỉnh sửa bài viết
        </button>
        <button className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Bookmark size={17} className="text-gray-500" />
            Lưu bài viết
        </button>
    </div>
}

const getPrivacyPost = (privacy: PrivacyType): ReactNode => {
    switch (privacy) {
        case PrivacyType.PRIVATE:
            return <Tooltip title='Chỉ mình tôi'>
                <button className="mb-[2px]">
                    <Lock size={14} />
                </button>
            </Tooltip>
        case PrivacyType.FRIENDS:
            return <Tooltip title='Bạn bè'>
                <button className="mb-[2px]">
                    <User size={14} />
                </button>
            </Tooltip>
        case PrivacyType.PUBLIC:
        default:
            return <Tooltip title='Công khai'>
                <button className="mb-[2px]">
                    <img className="w-3 h-3" src={images.earth} alt="Public" />
                </button>
            </Tooltip>
    }
}

const getBtnReaction = (reactionType: ReactionType | 'UNKNOWN', handleSaveReaction: (reactionType: ReactionType) => void): ReactNode => {
    if (reactionType === ReactionType.LIKE) {
        return <button onClick={() => handleSaveReaction(ReactionType.LIKE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.like} className="w-4 h-4 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-primary">Thích</span>
        </button>
    } else if (reactionType === ReactionType.LOVE) {
        return <button onClick={() => handleSaveReaction(ReactionType.LOVE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.love} className="w-4 h-4 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-red-600">Yêu thích</span>
        </button>
    } else if (reactionType === ReactionType.CARE) {
        return <button onClick={() => handleSaveReaction(ReactionType.CARE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.care} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Thương thương</span>
        </button>
    } else if (reactionType === ReactionType.SAD) {
        return <button onClick={() => handleSaveReaction(ReactionType.SAD)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.sad} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Buồn</span>
        </button>
    } else if (reactionType === ReactionType.HAHA) {
        return <button onClick={() => handleSaveReaction(ReactionType.HAHA)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.haha} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-yellow-500">Haha</span>
        </button>
    } else if (reactionType === ReactionType.WOW) {
        return <button onClick={() => handleSaveReaction(ReactionType.WOW)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.wow} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-orange-500">Wow</span>
        </button>
    } else if (reactionType === ReactionType.ANGRY) {
        return <button onClick={() => handleSaveReaction(ReactionType.ANGRY)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
            <img alt="like" src={svgReaction.angry} className="w-4 h-4 object-contain hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer" />
            <span className="text-orange-600">Phẫn nộ</span>
        </button>
    }

    return <button  onClick={() => handleSaveReaction(ReactionType.LIKE)} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
        <HeartIcon className="h-5 w-5 text-gray-500" />
        <span>Thích</span>
    </button>
}

type PostProps = {
    post: PostResource
}

export type CommentRequest = {
    postId: string;
    content: string;
    parentCommentId: string | null;
    replyToUserId: string | null;
}

export type ReactionRequest = {
    postId: string;
    reactionType: ReactionType;
}


const Post: FC<PostProps> = ({
    post
}) => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const { handleCancel: cancelReactionModal, isModalOpen: openReactionModal, handleOk: okReactionModal, showModal: showReactionModal } = useModal();
    const { handleCancel: cancelSharePost, isModalOpen: openSharePost, handleOk: okSharePost, showModal: showSharePost } = useModal();
    const [reactions, setReactions] = useState<ReactionResource[]>();
    const { user } = useSelector(selectAuth)
    const [reaction, setReaction] = useState<ReactionResource | null>();

    const fetchReactions = async () => {
        const response = await reactionService.getAllReactionsByPostId(post.id);

        if (response.isSuccess) {
            setReactions(response.data)

            const findMyReaction = response.data.find(s => s.user.id === user?.id);
            setReaction(findMyReaction)
        }
    }

    useEffect(() => {
        fetchReactions();
    }, [post])

    const handleCreateComment = async (values: BoxCommentType) => {
        const comment: CommentRequest = {
            content: values.content,
            postId: post.id,
            parentCommentId: null,
            replyToUserId: null,
        };

        const response = await commentService.createComment(comment);
        if (response.isSuccess) {
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const handleSaveReaction = async (reactionType: ReactionType) => {
        const payload: ReactionRequest = {
            postId: post.id,
            reactionType
        };


        const response = await reactionService.saveReaction(payload);
        if (response.isSuccess) {
            fetchReactions()
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md shadow">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <Avatar className="w-10 h-10" src={post.user.avatar ?? images.user} />
                <div className="flex flex-col gap-y-[1px]">
                    <span className="font-semibold text-[16px] text-gray-600">{post.user.fullName}</span>
                    <div className="flex items-center gap-x-2">
                        <Tooltip title='Thứ bảy, 23 tháng 11, 2014 lúc 19:17'>
                            <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
                        </Tooltip>
                        {getPrivacyPost(post.privacy)}
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
            <p className="text-sm text-gray-700 break-words">{post.content}</p>

            {post.medias.length > 0 && <PostMedia files={post.medias} />}

        </div>
        <div className="flex items-center justify-between text-sm">
            <button onClick={showReactionModal} className="flex gap-x-[2px] items-center">
                <Avatar.Group>
                    <img src={svgReaction.like} className="w-5 h-5 mx-[5px]" />
                    <img src={svgReaction.love} className="w-5 h-5 mx-[5px]" />
                    <img src={svgReaction.care} className="w-5 h-5 mx-[5px]" />
                </Avatar.Group>
                <span className="hover:underline">{reactions?.length}</span>
            </button>
            <div className="flex gap-x-4 items-center">
                <button className="hover:underline text-gray-500">{post.comments} bình luận</button>
                <button className="hover:underline text-gray-500">17 lượt chia sẻ</button>
            </div>
        </div>
        <Divider className='my-0' />
        <div className="flex items-center justify-between gap-x-4">
            <Popover content={<PostReaction
                onSelect={handleSaveReaction}
            />}>

                {getBtnReaction(reaction?.reactionType ?? 'UNKNOWN', handleSaveReaction)}
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

        <BoxSendComment
            onSubmit={handleCreateComment}
        />

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Bài viết của Bùi Việt</p>} width='700px' footer={[
            <BoxSendComment key={'box-send-comment'} />
        ]} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <PostModal post={post} />
        </Modal>

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Cảm xúc bài viết</p>} width='600px' footer={[]} open={openReactionModal} onOk={okReactionModal} onCancel={cancelReactionModal}>
            <PostReactionModal />
        </Modal>


        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Chia sẻ bài viết</p>} footer={[]} open={openSharePost} onOk={okSharePost} onCancel={cancelSharePost}>
            <SharePostModal />
        </Modal>
    </div>
};

export default Post;
