import { Avatar, Modal, Tooltip, message } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import useModal from "../../../hooks/useModal";
import { PostResource } from "../../../types/post";
import { formatTime, formatVietnamDate } from "../../../utils/date";
import reactionService from "../../../services/reactionService";
import { ReactionResource } from "../../../types/reaction";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { getPrivacyPost } from "../../../utils/post";
import { toast } from "react-toastify";
import postService from "../../../services/postService";
import { Link } from "react-router-dom";
import { GroupResource } from "../../../types/group";
import PostOtherTags from "../../../components/posts/PostOtherTags";
import ExpandableText from "../../../components/ExpandableText";
import PostMedia from "../../../components/posts/PostMedia";
import PostReactionModal from "../../../components/modals/PostReactionModal";
import ListSharePostModal from "../../../components/modals/ListSharePostModal";

export const getTopReactions = (reactions?: ReactionResource[], top: number = 3) => {
    const counts = reactions?.reduce((acc, reaction) => {
        acc[reaction.reactionType] = (acc[reaction.reactionType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return counts
        ? Object.entries(counts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, top) // Lấy top N
            .map(([reactionType, count]) => ({ reactionType, count }))
        : [];
};

type PostItemProps = {
    group?: GroupResource;
    post: PostResource;
}


const PostItem: FC<PostItemProps> = ({
    post: postParam,
    group,
}) => {
    const { handleCancel: cancelReactionModal, isModalOpen: openReactionModal, handleOk: okReactionModal, showModal: showReactionModal } = useModal();
    const { handleCancel: cancelListShare, isModalOpen: openListShare, handleOk: okListShare, showModal: showListShare } = useModal();

    const { user } = useSelector(selectAuth)
    const [reactions, setReactions] = useState<ReactionResource[]>();
    const [reaction, setReaction] = useState<ReactionResource | null>();
    const [topReactions, setTopReactions] = useState<{ reactionType: string; count: number }[]>([]);

    const [post, setPost] = useState<PostResource>(postParam);

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
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md shadow">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <div className="relative">
                    {!post.user.haveStory
                        ? <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" src={post.user.avatar ?? images.user} />
                        : <Link className="inline-block p-[1px] border-[2px] border-primary rounded-full" to={`/stories/${post.user.id}`}><Avatar className="w-9 h-9 flex-shrink-0" src={post.user.avatar ?? images.user} /> </Link>
                    }
                    {(post.user.isOnline || post.user.id === user?.id) && <div className="absolute bottom-0 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                </div>

                <div className="flex flex-col md:gap-y-[1px]">
                    <div className="text-gray-600 text-[13px] md:text-sm">
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
                                            <Link className="font-bold hover:underline hover:text-gray-600 text-sm" to={`/profile/${tag.user.id}`} key={tag.id}>
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
                        <button>{getPrivacyPost(post.privacy)}</button>
                    </div>
                </div>
            </div>
            
        </div>

        <div className="flex flex-col gap-y-3">
            {post.background ? <div style={{
                background: post.background,
                width: '100%',
            }} className="flex items-center md:h-[380px] sm:h-[350px] h-[280px] justify-center px-6 py-8 rounded-md">
                <p className="md:text-2xl text-lg font-bold text-center break-words break-all text-white">{post.content}</p>
            </div> : <ExpandableText content={post.content} />}
            {post.medias.length > 0 && <PostMedia files={post.medias} />}
        </div>


        {/*======== MODAL REACTION ====== */}
        <Modal style={{ top: 20 }} title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Cảm xúc bài viết</p>} width='600px' footer={[]} open={openReactionModal} onOk={okReactionModal} onCancel={cancelReactionModal}>
            <PostReactionModal reactions={reactions} />
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

    </div>
};

export default PostItem;
