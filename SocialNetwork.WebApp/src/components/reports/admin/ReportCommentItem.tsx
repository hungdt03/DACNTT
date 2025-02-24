import { Avatar, Button, Divider, Tooltip } from "antd";
import { FC } from "react";
import { extractContentFromJSON } from "../../comments/CommentItem";
import { CommentResource } from "../../../types/comment";
import { Link } from "react-router-dom";
import { formatTime, formatVietnamDate } from "../../../utils/date";
import images from "../../../assets";
import PostNotFound from "../../posts/PostNotFound";

type ReportCommentItemProps = {
    comment: CommentResource
}

const ReportCommentItem: FC<ReportCommentItemProps> = ({
    comment
}) => {

    if(comment === null) return <PostNotFound title='Bình luận không tồn tại hoặc đã bị gỡ' />

    return <div className="p-4 rounded-md shadow bg-white flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
                <Avatar className="w-10 h-10 flex-shrink-0" src={comment.user.avatar ?? images.user} />
                
                <div className="flex flex-col">
                    <Link to={`/profile/${comment.user.id}`}>{comment.user?.fullName}</Link>
                    <Tooltip title={formatVietnamDate(new Date(comment.createdAt))}>
                        <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(comment.createdAt))}</span>
                    </Tooltip>
                </div>
            </div>

            <p>{extractContentFromJSON(comment.content)}</p>
        </div>

        <Divider className="my-0" />
    </div>
};

export default ReportCommentItem;
