import { Avatar, Tooltip } from "antd";
import { FC } from "react";
import images from "../../assets";
import { PostResource } from "../../types/post";
import { getPrivacyPost } from "../../utils/post";
import { formatTime, formatVietnamDate } from "../../utils/date";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";

type PostShareItemProps = {
    post: PostResource
}

const PostShareItem: FC<PostShareItemProps> = ({
    post
}) => {
    return <div className="relative flex flex-col gap-y-2 bg-white rounded-xl overflow-hidden border-[1px] border-gray-200">
        <div className={cn("px-4 flex flex-col gap-y-2 py-2")}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Avatar className="w-10 h-10 flex-shrink-0" src={post.user.avatar ?? images.user} />
                    <div className="flex flex-col gap-y-[1px]">
                        <div className="font-bold text-[14px] text-gray-600">
                            <Link to={`/profile/${post.user.id}`}>{post.user?.fullName}</Link>
                            {post.tags.length > 0 &&
                                (() => {
                                    const maxDisplay = 3;
                                    const displayedTags = post.tags.slice(0, maxDisplay);
                                    const remainingTagsCount = post.tags.length - maxDisplay;

                                    return (
                                        <>
                                            {' cùng với '}
                                            {displayedTags.map((tag, index) => (
                                                <Link className="hover:underline" to={`/profile/${tag.id}`} key={tag.id}>
                                                    {tag.user.fullName}
                                                    {index < displayedTags.length - 1 ? ', ' : ''}
                                                </Link>
                                            ))}
                                            {remainingTagsCount > 0 && ` và ${remainingTagsCount} người khác`}
                                        </>
                                    );
                                })()}
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Tooltip title={formatVietnamDate(new Date(post.createdAt))}>
                                <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(post.createdAt))}</span>
                            </Tooltip>
                            {getPrivacyPost(post.privacy)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-3">
                <p className="text-sm text-gray-700">{post.content}</p>
            </div>
        </div>

    </div>
};

export default PostShareItem;
