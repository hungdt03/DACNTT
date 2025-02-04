import { Bookmark, Edit, Flag, Trash } from "lucide-react"
import { FC } from "react"

type PostMoreActionProps = {
    isMine: boolean;
    onEditPost?: () => void;
    onDeletePost?: () => void;
    onReportPost?: () => void
}

export const PostMoreAction: FC<PostMoreActionProps> = ({
    isMine,
    onEditPost,
    onDeletePost,
    onReportPost
}) => {

    return <div className="flex flex-col items-start rounded-md">
        {isMine && <>
            <button onClick={onEditPost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Edit size={17} className="text-gray-500" />
                Chỉnh sửa bài viết
            </button>
            <button onClick={onDeletePost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Trash size={17} className="text-gray-500" />
                Xóa bài viết
            </button>
        </>}
        {!isMine && <>
            <button className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Bookmark size={17} className="text-gray-500" />
                Lưu bài viết
            </button>
            <button onClick={onReportPost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Flag size={17} className="text-gray-500" />
                Báo cáo bài viết
            </button>
        </>}
    </div>
}
