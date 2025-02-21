import { Avatar, Divider, Modal, Popover, Tooltip, message } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { MoreHorizontal } from "lucide-react";
import { ChatBubbleLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import { ReactionSvgType, svgReaction } from "../../../assets/svg";
import useModal from "../../../hooks/useModal";
import PostReactionModal from "../../modals/PostReactionModal";
import SharePostModal from "../../modals/SharePostModal";
import { PostResource } from "../../../types/post";
import { formatTime, formatVietnamDate } from "../../../utils/date";
import { ReactionType } from "../../../enums/reaction";
import reactionService from "../../../services/reactionService";
import { ReactionResource } from "../../../types/reaction";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { getBtnReaction, getPrivacyPost } from "../../../utils/post";
import EditPostModal from "../../modals/EditPostModal";
import { Id, toast } from "react-toastify";
import postService from "../../../services/postService";
import { Link } from "react-router-dom";
import ListSharePostModal from "../../modals/ListSharePostModal";
import PostOtherTags from "../../posts/PostOtherTags";
import { PostReaction } from "../../posts/PostReaction";
import { PostMoreAction } from "../../posts/PostMoreAction";
import PostMedia from "../../posts/PostMedia";
import { GroupResource } from "../../../types/group";
import reportService from "../../../services/reportService";
import { PrivacyType } from "../../../enums/privacy";
import ReportPostModal from "../../modals/reports/ReportPostModal";
import ChangePostPrivacyModal from "../../modals/ChangePostPrivacyModal";
import { getTopReactions } from "../sharings/MentionSharePostInner";

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

type MentionPostInnerProps = {
    allowShare?: boolean;
    isShowMore?: boolean;
    isShowInteraction?: boolean;
    group?: GroupResource;
    post: PostResource;
    onFetch?: (data: PostResource) => void;
    onRemovePost?: (postId: string) => void
}


const MentionPostInner: FC<MentionPostInnerProps> = ({
    allowShare = true,
    isShowMore = true,
    isShowInteraction = true,
    post: postParam,
    group,
    onFetch,
    onRemovePost
}) => {
    const { handleCancel: editPostCancel, isModalOpen: isEditPostOpen, handleOk: handleEditPostOk, showModal: showEditPostModal } = useModal();
    const { handleCancel: cancelReactionModal, isModalOpen: openReactionModal, handleOk: okReactionModal, showModal: showReactionModal } = useModal();
    const { handleCancel: cancelSharePost, isModalOpen: openSharePost, handleOk: okSharePost, showModal: showSharePost } = useModal();
    const { handleCancel: cancelListShare, isModalOpen: openListShare, handleOk: okListShare, showModal: showListShare } = useModal();
    const { handleCancel: cancelReportAdmin, isModalOpen: openReportAdmin, handleOk: okReportAdmin, showModal: showReportAdmin } = useModal();
    const { handleCancel: cancelReport, isModalOpen: openReport, handleOk: okReport, showModal: showReport } = useModal();
    const { handleCancel: cancelPrivacy, isModalOpen: openPrivacy, handleOk: okPrivacy, showModal: showPrivacy } = useModal();

    const [reactions, setReactions] = useState<ReactionResource[]>();
    const { user } = useSelector(selectAuth)
    const [reaction, setReaction] = useState<ReactionResource | null>();
    const [topReactions, setTopReactions] = useState<{ reactionType: string; count: number }[]>([]);

    const [post, setPost] = useState<PostResource>(postParam);
    const [reason, setReason] = useState('')
    const [privacy, setPrivacy] = useState<PrivacyType>(post.privacy)

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

    const handleReportPost = async (reason: string) => {
        const response = await reportService.reportPost(post.id, reason, group?.id);
        if (response.isSuccess) {
            message.success(response.message)
            okReport()
            okReportAdmin()
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
            message.success(response.message)
            setPost(prev => ({
                ...prev,
                isSaved: false
            }))
        } else {
            message.error(response.message)
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

    const handleRevokeTag = async () => {
        const response = await postService.revokeTag(post.id);
        if (response.isSuccess) {
            fetchPostById()
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className="flex flex-col gap-y-2 bg-white rounded-md">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <div className="relative">
                    {!post.user.haveStory
                        ? <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" src={post.user.avatar ?? images.user} />
                        : <Link className="inline-block p-[1px] border-[2px] border-primary rounded-full" to={`/stories/${post.user.id}`}><Avatar className="w-9 h-9 flex-shrink-0" src={post.user.avatar ?? images.user} /> </Link>
                    }
                    {(post.user.isOnline || post.user.id === user?.id) && <div className="absolute bottom-0 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                </div>

                <div className="flex flex-col gap-y-[1px]">
                    <div className="font-semibold text-[13px] text-gray-600">
                        <Link className="font-bold text-[13px] hover:text-gray-600 hover:underline md:text-sm" to={`/${post.isGroupPost ? `groups/${post.group.id}/user` : 'profile'}/${post.user.id}`}>{post.user?.fullName}</Link>
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
                                            <Link className="text-[13px] font-bold hover:underline hover:text-gray-600" to={`/profile/${tag.user.id}`} key={tag.id}>
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
                        <Tooltip title={formatVietnamDate(new Date(post.createdAt))}>
                            <span className="text-[11px] md:text-xs md:font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
                        </Tooltip>
                         <button onClick={post.isGroupPost || post.user.id !== user?.id ? undefined : showPrivacy}>{getPrivacyPost(post.privacy)}</button>
                    </div>
                </div>
            </div>
            <Popover className="flex-shrink-0" content={<PostMoreAction
                onEditPost={showEditPostModal}
                onDeletePost={handleDeletePost}
                onReportPost={showReport}
                isHasTag={!!post.tags.find(s => s.user.id === user?.id)}
                onRevokeTag={handleRevokeTag}
                onReportPostGroup={showReportAdmin}
                onSavedPost={() => handleSavedPost(post.id)}
                onRemoveSavedPost={() => handleRemoveSavedPost(post.id)}
                isAdmin={group?.isMine}
                isPostGroup={group != undefined}
                isSaved={post.isSaved}
                isMine={post.user.id === user?.id}
            />}>
                {isShowMore && <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <MoreHorizontal size={16} className="text-gray-400" />
                </button>}
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
        <div className="flex items-center justify-between md:text-sm text-[13px]">
            <button onClick={showReactionModal} className="flex gap-x-[2px] items-center">
                <Avatar.Group>
                    {topReactions.map(reaction => <img key={reaction.reactionType} alt={reaction.reactionType} src={svgReaction[reaction.reactionType as ReactionSvgType]} className="w-5 h-5 mx-[5px]" />)}
                </Avatar.Group>
                <span className="hover:underline">{reactions?.length === 0 ? '' : reactions?.length}</span>
            </button>
            <div className="flex gap-x-4 items-center">
                <button className="hover:underline text-gray-500">{post.comments} bình luận</button>
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
            <button className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 md:text-sm text-[13px] text-gray-500">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-500" />
                <span>Bình luận</span>
            </button>
            <button onClick={showSharePost} className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 md:text-sm text-[13px] text-gray-500">
                <ShareIcon className="h-5 w-5 text-gray-500" />
                <span>Chia sẻ</span>
            </button>
        </div>
        <Divider className='mt-0 mb-2' />

        {/*======== MODAL REACTION ====== */}
        <Modal style={{ top: 20 }} title={<p className="text-center font-bold text-lg">Cảm xúc bài viết</p>} width='600px' footer={[]} open={openReactionModal} onOk={okReactionModal} onCancel={cancelReactionModal}>
            <PostReactionModal reactions={reactions} />
        </Modal>

        {/*======== MODAL EDIT POST ====== */}

        <Modal title={<p className="text-center font-bold text-lg">Chỉnh sửa bài viết</p>} footer={[]} open={isEditPostOpen} onOk={handleEditPostOk} onCancel={editPostCancel}>
            <EditPostModal
                onSubmit={handleEditPostAsync}
                post={post}
            />
        </Modal>

        {/*======== MODAL SHARE POST ====== */}

        <Modal style={{ top: 20 }} title={<p className="text-center font-bold text-lg">Chia sẻ bài viết</p>} footer={[]} open={openSharePost} onOk={okSharePost} onCancel={cancelSharePost}>
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

        {/*======== MODAL LIST SHARES ====== */}

        <Modal
            style={{ top: 20 }}
            title={<p className="text-center font-bold text-lg">Những người đã chia sẻ bài viết</p>}
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


        {/* REPORT TO ADMIN OF GROUP */}
        <Modal
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Báo cáo bài viết tới quản trị viên nhóm</p>}
            centered
            open={openReportAdmin}
            onOk={okReportAdmin}
            onCancel={cancelReportAdmin}
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

export default MentionPostInner;
