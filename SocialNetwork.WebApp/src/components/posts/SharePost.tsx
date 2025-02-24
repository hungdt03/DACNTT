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
import PostShareInner from "./PostShareInner";
import { PostMoreAction } from "./PostMoreAction";
import { PostReaction } from "./PostReaction";
import { PostResource } from "../../types/post";
import { getBtnReaction, getPrivacyPost } from "../../utils/post";
import { formatTime, formatVietnamDate } from "../../utils/date";
import { ReactionType } from "../../enums/reaction";
import { ReactionRequest, getTopReactions } from "./Post";
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
import PostNotFound from "./PostNotFound";
import ExpandableText from "../ExpandableText";
import ChangePostPrivacyModal from "../modals/ChangePostPrivacyModal";
import { PrivacyType } from "../../enums/privacy";
import ReportPostModal from "../modals/reports/ReportPostModal";
import reportService from "../../services/reportService";

type SharePostProps = {
    post: PostResource;
    onFetch?: (data: PostResource) => void;
    onRemovePost?: (postId: string) => void;
    onRemoveSavedPost?: (postId: string) => void;
    allowShare?: boolean;
}

const SharePost: FC<SharePostProps> = ({
    post: postParam,
    allowShare = true,
    onFetch,
    onRemovePost,
    onRemoveSavedPost
}) => {
    const { handleCancel, isModalOpen, handleOk, showModal } = useModal();
    const { handleCancel: cancelReactionModal, isModalOpen: openReactionModal, handleOk: okReactionModal, showModal: showReactionModal } = useModal();
    const { handleCancel: editPostCancel, isModalOpen: isEditPostOpen, handleOk: handleEditPostOk, showModal: showEditPostModal } = useModal();
    const { handleCancel: cancelSharePost, isModalOpen: openSharePost, handleOk: okSharePost, showModal: showSharePost } = useModal();
    const { handleCancel: cancelListShare, isModalOpen: openListShare, handleOk: okListShare, showModal: showListShare } = useModal();
    const { handleCancel: cancelPrivacy, isModalOpen: openPrivacy, handleOk: okPrivacy, showModal: showPrivacy } = useModal();
    const { handleCancel: cancelReport, isModalOpen: openReport, handleOk: okReport, showModal: showReport } = useModal();

    const [reactions, setReactions] = useState<ReactionResource[]>();
    const { user } = useSelector(selectAuth)
    const [reaction, setReaction] = useState<ReactionResource | null>();
    const [topReactions, setTopReactions] = useState<{ reactionType: string; count: number }[]>([]);
    const [privacy, setPrivacy] = useState<PrivacyType>(postParam.privacy)
    const [reason, setReason] = useState('')
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

    const handleDeletePost = async () => {
        const response = await postService.deletePost(post.id);
        if (response.isSuccess) {
            onRemovePost?.(post.id)
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

    const handleChangePrivacy = async (postId: string, privacy: PrivacyType) => {
        const response = await postService.changePrivacy(postId, privacy);
        if (response.isSuccess) {
            message.success(response.message)
            setPost(prev => ({
                ...prev,
                privacy: privacy
            }))

            okPrivacy()
        } else {
            message.error(response.message)
        }
    }


    const handleReportPost = async (reason: string) => {
        const response = await reportService.reportPost(post.id, reason);
        if (response.isSuccess) {
            message.success(response.message)
            okReport()
            setReason('')
        } else {
            message.error(response.message)
        }
    }

    const handleSavedPost = async (postId: string) => {
        const response = await postService.addSavedPost(postId);
        if (response.isSuccess) {
            message.success(response.message);
            setPost(prev => ({
                ...prev,
                isSaved: true
            }))
        } else {
            message.error(response.message)
        }
    }

    const handleRemoveSavedPost = async (postId: string) => {
        const response = await postService.removeSavedPostByPostId(postId);
        if (response.isSuccess) {
            onRemoveSavedPost?.(postId)
            message.success(response.message)
            setPost(prev => ({
                ...prev,
                isSaved: false
            }))
        } else {
            message.error(response.message)
        }
    }

    const handleRevokeTag = async () => {
        const response = await postService.revokeTag(post.id);
        if (response.isSuccess) {
            fetchPostById()
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    if(post === null) return <PostNotFound />

    return <div className="flex flex-col gap-y-3 p-4 bg-white rounded-md shadow">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <div className="relative flex-shrink-0">
                    {!post.user.haveStory
                        ? <Avatar className="w-8 h-8 md:w-10 md:h-10" src={post.user.avatar ?? images.user} />
                        : <Link className="inline-block p-[1px] border-[2px] border-primary rounded-full" to={`/stories/${post.user.id}`}><Avatar className="w-9 h-9 flex-shrink-0" src={post.user.avatar ?? images.user} /> </Link>
                    }
                    {(post.user.isOnline || post.user.id === user?.id) && <div className="absolute bottom-0 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                </div>
                <div className="flex flex-col gap-y-[1px]">
                    <div className="inline-flex items-center gap-x-1 flex-wrap text-[14px] text-gray-600">
                        <span className="font-bold">
                            <Link to={`/profile/${post.user.id}`} className="text-[13px] md:text-sm hover:text-gray-600 hover:underline inline">
                                {post.user?.fullName}
                            </Link>
                        </span>
                        {post.tags.length > 0 &&
                            (() => {
                                const maxDisplay = 3;
                                const displayedTags = post.tags.slice(0, maxDisplay);
                                const remainingTagsCount = post.tags.length - maxDisplay;
                                const remainingTags = post.tags.slice(maxDisplay);

                                return (
                                    <>
                                        <span> cùng với </span>
                                        {displayedTags.map((tag, index) => (
                                            <span key={tag.id}>
                                                <Link to={`/profile/${tag.user.id}`} className="text-sm hover:text-gray-600 font-bold hover:underline inline">
                                                    {tag.user.fullName}
                                                </Link>
                                                {index < displayedTags.length - 1 ? ", " : ""}
                                            </span>
                                        ))}
                                        {remainingTagsCount > 0 && (
                                            <Tooltip title={<PostOtherTags tags={remainingTags} />}>
                                                <span> và {remainingTagsCount} người khác</span>
                                            </Tooltip>
                                        )}
                                    </>
                                );
                            })()}
                        <span className="text-[13px] md:text-sm text-gray-400"> đã chia sẻ bài viết</span>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <Tooltip title={formatVietnamDate(new Date(post.createdAt))}>
                            <span className="text-[11px] md:text-xs md:font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
                        </Tooltip>
                        <button onClick={post.isGroupPost || post.user.id !== user?.id ? undefined : showPrivacy}>{getPrivacyPost(post.privacy)}</button>
                    </div>
                </div>
            </div>

            <Popover content={<PostMoreAction
                post={post}
                onEditPost={showEditPostModal}
                onDeletePost={handleDeletePost}
                onReportPost={showReport}
                isHasTag={!!post.tags.find(s => s.user.id === user?.id)}
                onRevokeTag={handleRevokeTag}
                onSavedPost={() => handleSavedPost(post.id)}
                onRemoveSavedPost={() => handleRemoveSavedPost(post.id)}
                isSaved={post.isSaved}
                isMine={post.user.id === user?.id}
            />}>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <MoreHorizontal size={16} className="text-gray-400" />
                </button>
            </Popover>
        </div>

        <div className="flex flex-col gap-y-3">
            <ExpandableText content={post.content} />
            {post.originalPostId ? <PostShareInner post={post.originalPost} /> : <PostNotFound />}
        </div>
        <div className="flex items-center justify-between md:text-sm text-[13px]">
            <button onClick={showReactionModal} className="flex gap-x-[2px] items-center">
                <Avatar.Group>
                    {topReactions.map(reaction => <img key={reaction.reactionType} alt={reaction.reactionType} src={svgReaction[reaction.reactionType as ReactionSvgType]} className="md:w-5 w-3 h-3 md:h-5 mx-[5px]" />)}
                </Avatar.Group>
                <span className="hover:underline">{reactions?.length === 0 ? '' : reactions?.length}</span>
            </button>
            <div className="flex gap-x-4 items-center">
                <button onClick={showModal} className="hover:underline text-gray-500">{post.comments} bình luận</button>
                {post.privacy === PrivacyType.PUBLIC && <button onClick={showListShare} className="hover:underline text-gray-500">{post.shares} lượt chia sẻ</button>}
            </div>
        </div>
        <Divider className='my-0' />
        <div className="flex items-center justify-between gap-x-4">
            <Popover content={<PostReaction
                onSelect={handleSaveReaction}
            />}>
                {getBtnReaction(reaction?.reactionType ?? 'UNKNOWN', handleSaveReaction)}
            </Popover>
            <button onClick={showModal} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex items-center justify-center gap-x-2 md:text-sm text-[13px] text-gray-500">
                <ChatBubbleLeftIcon className="md:h-5 md:w-5 w-4 h-4 text-gray-500" />
                <span>Bình luận</span>
            </button>
            {(post.originalPostId && allowShare) && (<button onClick={showSharePost} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ShareIcon className="md:h-5 md:w-5 w-4 h-4 text-gray-500" />
                <span>Chia sẻ</span>
            </button>)}
        </div>
        <Divider className='mt-0 mb-2' />

        <Modal style={{ top: 20 }} title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Bài viết của {post.user.fullName}</p>} width='700px' footer={[

        ]} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <PostModal post={post} />
        </Modal>

        <Modal style={{ top: 20 }} title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Cảm xúc bài viết</p>} width='600px' footer={[]} open={openReactionModal} onOk={okReactionModal} onCancel={cancelReactionModal}>
            <PostReactionModal reactions={reactions} />
        </Modal>

        <Modal title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Chỉnh sửa bài viết</p>} footer={[]} open={isEditPostOpen} onOk={handleEditPostOk} onCancel={editPostCancel}>
            <EditSharePostModal
                onSubmit={handleEditSharePostAsync}
                post={post}
            />
        </Modal>

        <Modal style={{ top: 20 }} title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Chia sẻ bài viết</p>} footer={[]} open={openSharePost} onOk={okSharePost} onCancel={cancelSharePost}>
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
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Những người đã chia sẻ bài viết</p>}
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


        {/* MODAL CHANGE PRIVACY*/}
        <Modal
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Chọn đối tượng</p>}
            centered
            open={openPrivacy}
            onOk={okPrivacy}
            onCancel={cancelPrivacy}
            okText='Lưu lại'
            cancelText='Hủy'
            okButtonProps={{
                onClick: () => void handleChangePrivacy(post.id, privacy),
                disabled: privacy === post.privacy
            }}
        >
            <ChangePostPrivacyModal
                privacy={privacy}
                onChange={(newPrivacy) => setPrivacy(newPrivacy)}
            />
        </Modal>

        {/* REPORT TO ADMIN OF APPLICATION*/}
        <Modal
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Báo cáo bài viết</p>}
            centered
            open={openReport}
            onOk={okReport}
            onCancel={cancelReport}
            okText='Gửi báo cáo'
            cancelText='Hủy'
            okButtonProps={{
                onClick: () => reason.trim().length >= 20 && void handleReportPost(reason),
                disabled: reason.trim().length < 20
            }}
        >
            <ReportPostModal
                value={reason}
                onChange={(newValue) => setReason(newValue)}
                title="Tại sao bạn báo cáo bài viết này"
                description="Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy tìm ngay sự giúp đỡ trước khi báo cáo với LinkUp."
            />
        </Modal>
    </div>
};

export default SharePost;
