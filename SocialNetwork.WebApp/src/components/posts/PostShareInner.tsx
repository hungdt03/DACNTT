import { Avatar, Tooltip } from "antd";
import { FC } from "react";
import images from "../../assets";
import PostMedia from "./PostMedia";
import { PostResource } from "../../types/post";
import { getPrivacyPost } from "../../utils/post";
import { formatTime, formatVietnamDate } from "../../utils/date";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";
import ExpandableText from "../ExpandableText";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import PostNotFound from "./PostNotFound";

type PostShareInnerProps = {
    post: PostResource
}

const PostShareInner: FC<PostShareInnerProps> = ({
    post
}) => {
    const { user } = useSelector(selectAuth)

    if (post.isGroupPost && post.group === null) return <PostNotFound />;

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
                                className={`border-[2px] border-primary inline-block rounded-full ${post.isGroupPost ? 'absolute -right-2 -bottom-2' : 'p-[1px]'}`}
                                to={`/stories/${post.user.id}`}
                            >
                                <Avatar
                                    className={`${post.isGroupPost ? 'w-6 h-6' : 'md:w-9 md:h-9 w-8 h-8 flex-shrink-0'} border-[1px] border-gray-50`}
                                    src={post.user.avatar ?? images.user}
                                />
                                {(post.user.isOnline || post.user.id === user?.id) && <div className="absolute -bottom-0 -right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                            </Link>
                        ) : (
                            <div className={`${post.isGroupPost ? 'absolute -right-2 -bottom-2' : 'flex-shrink-0'}`}>
                                <Avatar
                                    className={`${post.isGroupPost ? 'w-7 h-7 border-[1px] border-gray-50' : 'w-8 h-8 md:w-10 md:h-10'}`}
                                    src={post.user.avatar ?? images.user}
                                />
                                {(post.user.isOnline || post.user.id === user?.id) && <div className="absolute -bottom-0 -right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-y-[1px]">
                        <div className="text-[14px] text-gray-600">
                            {post.isGroupPost 
                                ? <Link to={`/groups/${post.group.id}`} className="font-bold text-[15px] hover:underline hover:text-gray-600">{post.group?.name}</Link>
                                :
                                <Link to={`/profile/${post.user.id}`} className="font-bold text-[13px] md:text-sm hover:text-gray-600 hover:underline">{post.user?.fullName}</Link>}
                            {post.tags.length > 0 &&
                                (() => {
                                    const maxDisplay = 3;
                                    const displayedTags = post.tags.slice(0, maxDisplay);
                                    const remainingTagsCount = post.tags.length - maxDisplay;

                                    return (
                                        <>
                                            {' cùng với '}
                                            {displayedTags.map((tag, index) => (
                                                <Link className="font-bold hover:text-gray-600 hover:underline" to={`/profile/${tag.id}`} key={tag.id}>
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
                            {post.isGroupPost && <Link className="font-bold hover:underline text-[13px] text-gray-500 hover:text-gray-600" to={`/profile/${post.user.id}`}>{post.user?.fullName}</Link>}
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
                    height: 380
                }} className="flex items-center justify-center px-6 py-8 rounded-md">
                    <p className="text-2xl font-bold text-center break-words break-all text-white">{post.content}</p>
                </div> : <ExpandableText content={post.content} />}
            </div>
        </div>
    </div>
};

export default PostShareInner;
