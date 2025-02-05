import { FC, useEffect, useState } from "react";
import useModal from "../../hooks/useModal";
import { Avatar, Divider, Modal, Popover, Tooltip, message } from "antd";
import images from "../../assets";
import { MoreHorizontal, ShareIcon } from "lucide-react";
import { ReactionSvgType, svgReaction } from "../../assets/svg";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import PostReactionModal from "../modals/PostReactionModal";
import PostModal from "../modals/PostModal";
import SharePostModal from "../modals/SharePostModal";
import { Link } from "react-router-dom";
import PostMedia from "./PostMedia";
import { PostMoreAction } from "./PostMoreAction";
import { PostResource } from "../../types/post";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { PostReaction } from "./PostReaction";
import PostOtherTags from "./PostOtherTags";
import { formatTime, formatVietnamDate } from "../../utils/date";
import { getBtnReaction, getPrivacyPost } from "../../utils/post";
import reactionService from "../../services/reactionService";
import { ReactionRequest, getTopReactions } from "./Post";
import { ReactionResource } from "../../types/reaction";
import { Id, toast } from "react-toastify";
import { ReactionType } from "../../enums/reaction";
import postService from "../../services/postService";
import ListSharePostModal from "../modals/ListSharePostModal";
import EditPostModal from "../modals/EditPostModal";
import { GroupPrivacy } from "../../enums/group-privacy";

type PostGroupProps = {
    post: PostResource;
    onFetch?: (data: PostResource) => void;
    onRemovePost?: (postId: string) => void
}

const PostGroup: FC<PostGroupProps> = ({
    post: postParam,
    onFetch,
    onRemovePost
}) => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const { handleCancel: editPostCancel, isModalOpen: isEditPostOpen, handleOk: handleEditPostOk, showModal: showEditPostModal } = useModal();
    const { handleCancel: cancelReactionModal, isModalOpen: openReactionModal, handleOk: okReactionModal, showModal: showReactionModal } = useModal();
    const { handleCancel: cancelSharePost, isModalOpen: openSharePost, handleOk: okSharePost, showModal: showSharePost } = useModal();
    const { handleCancel: cancelListShare, isModalOpen: openListShare, handleOk: okListShare, showModal: showListShare } = useModal();

    const { user } = useSelector(selectAuth);

    const [post, setPost] = useState<PostResource>(postParam)
    const [reactions, setReactions] = useState<ReactionResource[]>();
    const [reaction, setReaction] = useState<ReactionResource | null>();
    const [topReactions, setTopReactions] = useState<{ reactionType: string; count: number }[]>([]);


    const fetchReactions = async () => {
        const response = await reactionService.getAllReactionsByPostId(post.id);

        if (response.isSuccess) {
            setReactions(response.data)

            const top3Reactions = getTopReactions(response.data)
            setTopReactions(top3Reactions)

            const findMyReaction = response.data.find(s => s.user.id === user?.id);
            setReaction(findMyReaction)
        }
    }

    useEffect(() => {
        fetchReactions();
    }, [post])

    const fetchPostById = async () => {
        const response = await postService.getPostById(post.id);

        if (response.isSuccess) {
            setPost(response.data);
        } else {
            toast.error(response.message);
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
        } else {
            message.error(response.message)
        }
    }

    const handleEditPostAsync = async (values: FormData): Promise<boolean> => {
        const toastId: Id = toast.loading('Đang cập nhật bài viết... Vui lòng không refresh lại trang');
        handleEditPostOk();

        post.group && values.append('groupId', post.group.id)

        try {
            const response = await postService.editPost(post.id, values);
            if (response.isSuccess) {
                fetchPostById();

                toast.update(toastId, {
                    render: response.message,
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });

                return true;
            } else {
                toast.update(toastId, {
                    render: response.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                });

                return false;
            }
        } catch (error) {
            toast.update(toastId, {
                render: error as string,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
            return false;
        }
    }

    const handleDeletePost = async () => {
        const response = await postService.deletePost(post.id);
        if (response.isSuccess) {
            onRemovePost?.(post.id)
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }


    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md shadow">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <div className="relative">
                    <img className="w-10 h-10 rounded-md object-cover" src={post.group.coverImage ?? images.cover} />

                    {!post.user.haveStory
                        ? <Avatar className="w-7 h-7 absolute -right-2 -bottom-2 border-[1px] border-gray-50" src={post.user.avatar ?? images.user} />
                        : <Link className="absolute -right-2 -bottom-2 border-[2px] border-primary rounded-full" to={`/stories/${post.user.id}`}><Avatar className="w-6 h-6 border-[1px] border-gray-50" src={post.user.avatar ?? images.user} /> </Link>
                    }
                </div>
                <div className="flex flex-col gap-y-[1px]">
                    <div className="font-semibold text-[15px] text-gray-800">
                        <Link to={`/groups/${post.group.id}`}>{post.group?.name}</Link>
                        {post.tags.length > 0 &&
                            (() => {
                                const maxDisplay = 3;
                                const displayedTags = post.tags.slice(0, maxDisplay);
                                const remainingTagsCount = post.tags.length - maxDisplay;
                                const remainingTags = post.tags.slice(maxDisplay)

                                return (
                                    <>
                                        {' cùng với '}
                                        {displayedTags.map((tag, index) => (
                                            <Link className="hover:underline" to={`/profile/${tag.user.id}`} key={tag.id}>
                                                {tag.user.fullName}
                                                {index < displayedTags.length - 1 ? ', ' : ''}
                                            </Link>
                                        ))}
                                        <Tooltip title={<PostOtherTags tags={remainingTags} />}>
                                            {remainingTagsCount > 0 && ` và ${remainingTagsCount} người khác`}
                                        </Tooltip>
                                    </>
                                );
                            })()}
                    </div>
                    <div className="flex items-center gap-x-2">

                        <Link className="font-semibold text-[13px] text-gray-600" to={`/profile/${post.user.id}`}>{post.user?.fullName}</Link>
                        <Tooltip title={formatVietnamDate(new Date(post.createdAt))}>
                            <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
                        </Tooltip>
                        {getPrivacyPost(post.privacy)}
                    </div>
                </div>
            </div>

            <Popover className="flex-shrink-0" content={<PostMoreAction
                onEditPost={showEditPostModal}
                onDeletePost={handleDeletePost}
                isMine={post.user.id === user?.id}
            />}>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <MoreHorizontal className="text-gray-400" />
                </button>
            </Popover>
        </div>

        <div className="flex flex-col gap-y-3">
            {post.background ? <div style={{
                background: post.background,
                width: '100%',
                height: 380
            }} className="flex items-center justify-center px-6 py-8 rounded-md">
                <p className="text-2xl font-bold text-center break-words break-all text-white">{post.content}</p>
            </div> : <p className="text-sm text-gray-700 break-words">{post.content}</p>}
            {post.medias.length > 0 && <PostMedia files={post.medias} />}
        </div>
        <div className="flex items-center justify-between text-sm">
            <button onClick={showReactionModal} className="flex gap-x-[2px] items-center">
                <Avatar.Group>
                    {topReactions.map(reaction => <img key={reaction.reactionType} alt={reaction.reactionType} src={svgReaction[reaction.reactionType.toLowerCase() as ReactionSvgType]} className="w-5 h-5 mx-[5px]" />)}
                </Avatar.Group>
                <span className="hover:underline">{reactions?.length === 0 ? '' : reactions?.length}</span>
            </button>
            <div className="flex gap-x-4 items-center">
                <button onClick={showModal} className="hover:underline text-gray-500">{post.comments} bình luận</button>
                <button onClick={showListShare} className="hover:underline text-gray-500">{post.shares} lượt chia sẻ</button>
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
            {post.group.privacy === GroupPrivacy.PUBLIC && <button onClick={showSharePost} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ShareIcon className="h-5 w-5 text-gray-500" />
                <span>Chia sẻ</span>
            </button>}
        </div>
        <Divider className='mt-0 mb-2' />

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Bài viết của Bùi Việt</p>} width='700px' classNames={{
            footer: 'hidden'
        }} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {isModalOpen && <PostModal post={post} />}
        </Modal>

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Cảm xúc bài viết</p>} width='600px' footer={[]} open={openReactionModal} onOk={okReactionModal} onCancel={cancelReactionModal}>
            <PostReactionModal reactions={reactions} />
        </Modal>

        {/*======== MODAL EDIT POST ====== */}

        <Modal title={<p className="text-center font-semibold text-xl">Chỉnh sửa bài viết</p>} footer={[]} open={isEditPostOpen} onOk={handleEditPostOk} onCancel={editPostCancel}>
            <EditPostModal
                onSubmit={handleEditPostAsync}
                post={post}
            />
        </Modal>


        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Chia sẻ bài viết</p>} footer={[]} open={openSharePost} onOk={okSharePost} onCancel={cancelSharePost}>
            <SharePostModal
                onSuccess={(data, msg) => {
                    okSharePost()
                    onFetch?.(data)
                    toast.success(msg)
                }}
                onFailed={msg => toast.error(msg)}
                post={post}
            />
        </Modal>

        <Modal
            style={{ top: 20 }}
            title={<p className="text-center font-semibold text-xl">Những người đã chia sẻ bài viết</p>}
            width='500px'
            centered
            open={openListShare}
            onOk={okListShare}
            onCancel={cancelListShare}
            classNames={{
                footer: 'hidden'
            }}
        >
            <ListSharePostModal post={post} />
        </Modal>
    </div>
};

export default PostGroup;
