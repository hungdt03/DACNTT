import { FC } from "react";
import { PostResource } from "../../../types/post";
import { Avatar, Divider, Tooltip } from "antd";
import images from "../../../assets";
import { Link } from "react-router-dom";
import { formatTime, formatVietnamDate } from "../../../utils/date";
import { getPrivacyPost } from "../../../utils/post";
import PostMedia from "../../posts/PostMedia";
import PostNotFound from "../../posts/PostNotFound";

type ReportPostItemProps = {
    post: PostResource
}

const ReportPostItem: FC<ReportPostItemProps> = ({
    post
}) => {

    if(post === null) return <PostNotFound />
    return <div className="flex flex-col gap-y-2">
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Avatar className="w-7 h-7 flex-shrink-0" src={post.user.avatar ?? images.user} />

                    <div className="flex flex-col gap-y-[1px]">
                        <div className="font-bold text-[13px] text-gray-600">
                            <Link to={`/admin/users/${post.user.id}`}>{post.user?.fullName}</Link>
                            {post.tags?.length > 0 &&
                                (() => {
                                    const maxDisplay = 3;
                                    const displayedTags = post.tags.slice(0, maxDisplay);
                                    const remainingTagsCount = post.tags.length - maxDisplay;
                                    const remainingTags = post.tags.slice(maxDisplay)

                                    return (
                                        <>
                                            {' cùng với '}
                                            {displayedTags?.map((tag, index) => (
                                                <Link className="hover:underline" to={`/profile/${tag.user.id}`} key={tag.id}>
                                                    {tag.user.fullName}
                                                    {index < displayedTags.length - 1 ? ', ' : ''}
                                                </Link>
                                            ))}
                                            {remainingTags && <Tooltip title={<div className="flex flex-col gap-y-1">
                                                {remainingTags.map(tag => <Link key={tag.id} to={`/admin/users/${tag.user.id}`} className="text-xs hover:text-white hover:underline">{tag.user.fullName}</Link>)}
                                            </div>}>
                                                {remainingTagsCount > 0 && ` và ${remainingTagsCount} người khác`}
                                            </Tooltip>}
                                        </>
                                    );
                                })()}
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Tooltip title={formatVietnamDate(new Date(post.createdAt))}>
                                <span className="text-[11px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
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
                    height: 280
                }} className="flex items-center justify-center px-6 py-8 rounded-md">
                    <p className="text-xl font-bold text-center break-words break-all text-white">{post.content}</p>
                </div> : <p className="text-sm text-gray-700 break-words">{post.content}</p>}
                {post.medias.length > 0 && <PostMedia files={post.medias} />}
            </div>
        </div>
    </div>
};

export default ReportPostItem;
