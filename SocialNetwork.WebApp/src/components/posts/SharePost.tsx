import { FC, useEffect, useState } from "react";
import useModal from "../../hooks/useModal";
import { Avatar, Divider, Modal, Popover, Tooltip, message } from "antd";
import images from "../../assets";
import { MoreHorizontal, ShareIcon } from "lucide-react";
import { ReactionSvgType, svgReaction } from "../../assets/svg";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import PostReactionModal from "../modals/PostReactionModal";
import PostModal, { BoxCommendStateType } from "../modals/PostModal";
import SharePostModal from "../modals/SharePostModal";
import PostShareInner from "./PostShareInner";
import BoxSendComment, { BoxCommentType } from "../comments/BoxSendComment";
import { PostMoreAction } from "./PostMoreAction";
import { PostReaction } from "./PostReaction";
import { PostResource } from "../../types/post";
import { getBtnReaction, getPrivacyPost } from "../../utils/post";
import { formatTime, formatVietnamDate } from "../../utils/date";
import { ReactionType } from "../../enums/reaction";
import { ReactionRequest, getTopReactions } from "./Post";
import commentService from "../../services/commentService";
import postService from "../../services/postService";
import { Id, toast } from "react-toastify";
import reactionService from "../../services/reactionService";
import { ReactionResource } from "../../types/reaction";
import { selectAuth } from "../../features/slices/auth-slice";
import { useSelector } from "react-redux";
import EditSharePostModal, { EditSharePostRequest } from "../modals/EditSharePostModal";
import { Link } from "react-router-dom";
import ListSharePostModal from "../modals/ListSharePostModal";
import PostOtherTags from "./PostOtherTags";

type SharePostProps = {
    post: PostResource;
    onFetch?: (data: PostResource) => void;
}

const SharePost: FC<SharePostProps> = ({
    post: postParam,
    onFetch
}) => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const { handleCancel: cancelReactionModal, isModalOpen: openReactionModal, handleOk: okReactionModal, showModal: showReactionModal } = useModal();
    const { handleCancel: editPostCancel, isModalOpen: isEditPostOpen, handleOk: handleEditPostOk, showModal: showEditPostModal } = useModal();
    const { handleCancel: cancelSharePost, isModalOpen: openSharePost, handleOk: okSharePost, showModal: showSharePost } = useModal();
    const { handleCancel: cancelListShare, isModalOpen: openListShare, handleOk: okListShare, showModal: showListShare } = useModal();

    const [reactions, setReactions] = useState<ReactionResource[]>();
    const { user } = useSelector(selectAuth)
    const [reaction, setReaction] = useState<ReactionResource | null>();
    const [topReactions, setTopReactions] = useState<{ reactionType: string; count: number }[]>([]);
    const [commentData, setCommentData] = useState<BoxCommendStateType>({
        content: '',
        fileList: []
    })
    const [post, setPost] = useState<PostResource>(postParam)

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

    const handleCreateComment = async (values: BoxCommentType) => {
        const formData = new FormData();
        formData.append('content', values.content);
        formData.append('postId', post.id);

        if (values?.file?.originFileObj) {
            formData.append('file', values.file.originFileObj, values.file.name);
        }
        const response = await commentService.createComment(formData);
        if (response.isSuccess) {
            message.success(response.message)
            setCommentData({
                content: '',
                fileList: []
            })
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
        } else {
            message.error(response.message)
        }
    }

    const handleEditSharePostAsync = async (values: EditSharePostRequest): Promise<boolean> => {
        const toastId: Id = toast.loading('Đang cập nhật bài viết... Vui lòng không refresh lại trang');
        handleEditPostOk();

        try {
            const response = await postService.editSharePost(post.id, values);
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

    return <div className="flex flex-col gap-y-3 p-4 bg-white rounded-md shadow">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <Avatar className="w-10 h-10 flex-shrink-0" src={post.user.avatar ?? images.user} />
                <div className="flex flex-col gap-y-[1px]">
                    <div className="flex items-center gap-x-1">
                        <div className="font-semibold text-[15px] text-gray-600">
                            <Link to={`/profile/${post.user.id}`}>{post.user?.fullName}</Link>
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
                        <p className="text-gray-400">đã chia sẻ bài viết</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Tooltip title={formatVietnamDate(new Date(post.createdAt))}>
                            <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
                        </Tooltip>
                        {getPrivacyPost(post.privacy)}
                    </div>
                </div>
            </div>

            <Popover content={<PostMoreAction
                onEditPost={showEditPostModal}
            />}>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <MoreHorizontal className="text-gray-400" />
                </button>
            </Popover>
        </div>

        <div className="flex flex-col gap-y-3">
            <p className="text-sm text-gray-700">{post.content}</p>
            <PostShareInner post={post.originalPost} />
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
            <button onClick={showSharePost} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ShareIcon className="h-5 w-5 text-gray-500" />
                <span>Chia sẻ</span>
            </button>
        </div>
        <Divider className='mt-0 mb-2' />
        <BoxSendComment
            value={commentData.content}
            onContentChange={(newValue) => setCommentData({
                ...commentData,
                content: newValue
            })}
            onSubmit={handleCreateComment}
            key={'box-send-comment'}
            files={commentData.fileList}
            onFileChange={(file) => setCommentData({
                ...commentData,
                fileList: [file]
            })}
        />

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Bài viết của Bùi Việt</p>} width='700px' footer={[

        ]} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <PostModal post={post} />
        </Modal>

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Cảm xúc bài viết</p>} width='600px' footer={[]} open={openReactionModal} onOk={okReactionModal} onCancel={cancelReactionModal}>
            <PostReactionModal reactions={reactions} />
        </Modal>

        <Modal title={<p className="text-center font-semibold text-xl">Chỉnh sửa bài viết</p>} footer={[]} open={isEditPostOpen} onOk={handleEditPostOk} onCancel={editPostCancel}>
            <EditSharePostModal
                onSubmit={handleEditSharePostAsync}
                post={post}
            />
        </Modal>

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Chia sẻ bài viết</p>} footer={[]} open={openSharePost} onOk={okSharePost} onCancel={cancelSharePost}>
            <SharePostModal
                post={post}
                onSuccess={(data, msg) => {
                    okSharePost()
                    onFetch?.(data)
                    toast.success(msg)
                }}
                onFailed={msg => toast.error(msg)}
            />
        </Modal>

        {/*======== MODAL LIST SHARES ====== */}

        <Modal
            style={{ top: 20 }}
            title={<p className="text-center font-semibold text-xl">Những người đã chia sẻ bài viết</p>}
            width='500px'
            centered
            open={openListShare}
            onOk={okListShare}
            onCancel={cancelListShare}
        >
            <ListSharePostModal post={post} />
        </Modal>
    </div>
};

export default SharePost;
