import { FC } from "react";
import { PostResource } from "../../../types/post";
import { Avatar, Button, Divider, Tooltip } from "antd";
import { Link } from "react-router-dom";
import PostOtherTags from "../../posts/PostOtherTags";
import { formatTime, formatVietnamDate } from "../../../utils/date";
import { getPrivacyPost } from "../../../utils/post";
import PostMedia from "../../posts/PostMedia";
import images from "../../../assets";

type PendingPostProps = {
    post: PostResource;
    onApproval: () => void
    onReject: () => void
}

const PendingPost: FC<PendingPostProps> = ({
    post,
    onApproval,
    onReject
}) => {
    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md shadow">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
            {!post.user.haveStory 
                    ? <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" src={post.user.avatar ?? images.user} /> 
                    : <Link className="p-[1px] border-[2px] border-primary rounded-full" to={`/stories/${post.user.id}`}><Avatar className="w-9 h-9 flex-shrink-0" src={post.user.avatar ?? images.user} /> </Link>
                }
                <div className="flex flex-col gap-y-[1px]">
                    <div className="font-semibold text-[15px] text-gray-600">
                    <Link className="text-[13px] md:text-sm hover:text-gray-600 font-bold" to={`/profile/${post.user.id}`}>{post.user?.fullName}</Link>
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
                        <Tooltip title={formatVietnamDate(new Date(post.createdAt))}>
                        <span className="text-[11px] md:text-xs md:font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
                        </Tooltip>
                        {getPrivacyPost(post.privacy)}
                    </div>
                </div>
            </div>

        </div>

        <div className="flex flex-col gap-y-3">
            {post.background ? <div style={{
                background: post.background,
                width: '100%',
            }} className="flex items-center md:h-[380px] sm:h-[350px] h-[280px] justify-center px-6 py-8 rounded-md">
                <p className="text-lg lg:text-2xl font-bold text-center break-words break-all text-white">{post.content}</p>
            </div> : <p className="text-sm text-gray-700 break-words">{post.content}</p>}
            {post.medias.length > 0 && <PostMedia files={post.medias} />}
        </div>

        <Divider className="my-2" />

        <div className="flex items-center justify-between">
            <span className="text-[13px] md:text-sm font-semibold">Vào lúc: {formatVietnamDate(new Date(post.createdAt))}</span>
            <div className="flex items-center flex-wrap gap-y-2 gap-x-3">
                <Button onClick={onApproval} type="primary">Phê duyệt</Button>
                <button onClick={onReject} className="px-3 py-[6px] hover:bg-gray-200 rounded-md font-semibold text-sm bg-gray-100">
                    Từ chối
                </button>
            </div>
        </div>
    </div>
};

export default PendingPost;
