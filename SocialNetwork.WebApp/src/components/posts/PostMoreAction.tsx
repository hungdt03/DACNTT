import { Bookmark, Edit, Flag, FlagOff, Tags, Trash } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { GroupMemberResource } from "../../types/group-member";
import groupService from "../../services/groupService";
import { PostResource } from "../../types/post";
import { MemberRole } from "../../enums/member-role";

type PostMoreActionProps = {
    post: PostResource
    isMine: boolean;
    isAdmin?: boolean;
    isHasTag?: boolean;
    isSaved?: boolean;
    isPostGroup?: boolean;
    onEditPost?: () => void;
    onDeletePost?: () => void;
    onReportPostGroup?: () => void;
    onReportPost?: () => void;
    onSavedPost?: () => void;
    onRemoveSavedPost?: () => void;
    onRevokeTag?: () => void;
}

export const PostMoreAction: FC<PostMoreActionProps> = ({
    post,
    isMine,
    isHasTag,
    isSaved,
    isPostGroup,
    isAdmin,
    onEditPost,
    onDeletePost,
    onReportPost,
    onReportPostGroup,
    onSavedPost,
    onRemoveSavedPost,
    onRevokeTag
}) => {
    const [postUser, setPostUser] = useState<GroupMemberResource>();

    useEffect(() => {
        const fetchPostUser = async () => {
            if (post.group.id) {
                const response = await groupService.getGroupMemberByGroupIdAndUserId(post.group.id, post.user.id);
                if (response.isSuccess) {
                    setPostUser(response.data)
                }
            }
        }

        fetchPostUser();
    }, [post]);

    return <div className="flex flex-col items-start rounded-md md:text-sm text-xs">
        {isMine && <button onClick={onEditPost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Edit size={17} className="text-gray-500" />
            Chỉnh sửa bài viết
        </button>}

        {((isAdmin && isPostGroup) || isMine) && <button onClick={onDeletePost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Trash size={17} className="text-gray-500" />
            Xóa bài viết
        </button>}

        {!isMine && <>
            {isSaved ? <button onClick={onRemoveSavedPost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Bookmark size={17} className="text-gray-500" />
                Bỏ lưu bài viết
            </button> : <button onClick={onSavedPost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Bookmark size={17} className="text-gray-500" />
                Lưu bài viết
            </button>}

            {!isAdmin && isPostGroup && postUser?.role !== MemberRole.ADMIN ? <>
                <button onClick={onReportPostGroup} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <FlagOff size={17} className="text-gray-500" />
                    Báo cáo bài viết với quản trị viên nhóm
                </button>
                <button onClick={onReportPost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <Flag size={17} className="text-gray-500" />
                    Báo cáo bài viết
                </button>
            </> : !isPostGroup && <button onClick={onReportPost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Flag size={17} className="text-gray-500" />
                Báo cáo bài viết
            </button>}

            {isHasTag && <button onClick={onRevokeTag} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Tags size={17} className="text-gray-500" />
                Gỡ thẻ
            </button>}
        </>}
    </div>
}
