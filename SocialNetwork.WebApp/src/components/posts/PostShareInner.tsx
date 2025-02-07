import { Avatar, Tooltip } from "antd";
import { FC } from "react";
import images from "../../assets";
import PostMedia from "./PostMedia";
import { PostResource } from "../../types/post";
import { getPrivacyPost } from "../../utils/post";
import { formatTime, formatVietnamDate } from "../../utils/date";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";

type PostShareInnerProps = {
    post: PostResource
}

const PostShareInner: FC<PostShareInnerProps> = ({
    post
}) => {
    return <div className="flex flex-col gap-y-2 bg-white rounded-xl overflow-hidden border-[1px] border-gray-200">
        {post.medias.length > 0 && <PostMedia files={post.medias} />}
        <div className={cn("px-4 flex flex-col gap-y-2", post.medias.length > 0 ? 'py-6' : 'py-2')}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <div className="relative">
                        {post.isGroupPost ? (
                            <img className="w-10 h-10 rounded-md object-cover" src={post.group.coverImage ?? images.cover} />
                        ) : null}

                        {post.user.haveStory ? (
                            <Link
                                className={`absolute -right-2 -bottom-2 border-[2px] border-primary rounded-full ${post.isGroupPost ? '' : 'p-[1px]'}`}
                                to={`/stories/${post.user.id}`}
                            >
                                <Avatar
                                    className={`${post.isGroupPost ? 'w-6 h-6' : 'w-9 h-9 flex-shrink-0'} border-[1px] border-gray-50`}
                                    src={post.user.avatar ?? images.user}
                                />
                            </Link>
                        ) : (
                            <Avatar
                                className={`${post.isGroupPost ? 'w-7 h-7 absolute -right-2 -bottom-2 border-[1px] border-gray-50' : 'w-10 h-10 flex-shrink-0'}`}
                                src={post.user.avatar ?? images.user}
                            />
                        )}
                    </div>

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
                {post.background ? <div style={{
                    background: post.background,
                    width: '100%',
                    height: 380
                }} className="flex items-center justify-center px-6 py-8 rounded-md">
                    <p className="text-2xl font-bold text-center break-words break-all text-white">{post.content}</p>
                </div> : <p className="text-sm text-gray-700 break-words">{post.content}</p>}
            </div>
        </div>
    </div>
};

export default PostShareInner;
