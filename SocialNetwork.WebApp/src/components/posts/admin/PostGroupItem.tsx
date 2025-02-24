import { Avatar, Modal, Tooltip } from "antd";
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
import { Link } from "react-router-dom";
import { GroupResource } from "../../../types/group";
import PostOtherTags from "../../../components/posts/PostOtherTags";
import ExpandableText from "../../../components/ExpandableText";
import PostMedia from "../../../components/posts/PostMedia";
import PostReactionModal from "../../../components/modals/PostReactionModal";
import ListSharePostModal from "../../../components/modals/ListSharePostModal";
import { getTopReactions } from "./PostItem";
import PostNotFound from "../PostNotFound";

type PostGroupItemProps = {
    group?: GroupResource;
    post: PostResource;
}


const PostItemGroup: FC<PostGroupItemProps> = ({
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

    if(post === null) return <PostNotFound />

    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md shadow">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-2">
                    <div className="relative">
                        <img alt="Ảnh nhóm" className="w-10 hed-md object-cover" src={post.group?.coverImage ?? images.cover} />
                        <Avatar className="w-7 h-7 absolute -right-2 -bottom-2 border-[1px] border-gray-50" src={post.user.avatar ?? images.user} />
                        {(post.user.isOnline || post.user.id === user?.id) && <div className="absolute -bottom-2 -right-2 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                    </div>
                    <div className="flex flex-col gap-y-[1px]">
                        <div className="font-semibold text-[15px] text-gray-600">
                            <Link to={`/admin/groups/${post.group.id}`} className="font-bold text-[15px] hover:underline hover:text-gray-600">{post.group?.name}</Link>
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
                                                <Link className="hover:underline hover:text-gray-600 font-bold" to={`/admin/users/${tag.user.id}`} key={tag.id}>
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
                            <Link className="font-bold hover:underline text-[13px] text-gray-600 hover:text-gray-600" to={`/profile/${post.user.id}`}>{post.user?.fullName}</Link>
                            <Tooltip title={formatVietnamDate(new Date(post.createdAt))}>
                                <span className="text-[12px] md:text-xs md:font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
                            </Tooltip>
                            {getPrivacyPost(post.privacy)}
                        </div>
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

export default PostItemGroup;
