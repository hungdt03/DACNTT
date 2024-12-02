import { Avatar,  Tooltip } from "antd";
import { FC } from "react";
import images from "../../assets";
import PostMedia from "./PostMedia";
import { PostResource } from "../../types/post";
import { getPrivacyPost } from "../../utils/post";
import { formatTime } from "../../utils/date";
import cn from "../../utils/cn";

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
                    <Avatar className="w-10 h-10" src={post.user.avatar ?? images.user} />
                    <div className="flex flex-col gap-y-[1px]">
                        <span className="font-semibold text-[16px] text-gray-600">{post.user.fullName}</span>
                        <div className="flex items-center gap-x-2">
                            <Tooltip title='Thứ bảy, 23 tháng 11, 2014 lúc 19:17'>
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

export default PostShareInner;
