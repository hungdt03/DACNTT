import { Bookmark, Edit } from "lucide-react"
import { FC } from "react"

type PostMoreActionProps = {
    onEditPost?: () => void
}

export const PostMoreAction: FC<PostMoreActionProps> = ({
    onEditPost
}) => {
    return <div className="flex flex-col items-start rounded-md">
        <button onClick={onEditPost} className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Edit size={17} className="text-gray-500" />
            Chỉnh sửa bài viết
        </button>
        <button className="w-full flex items-center gap-x-2 py-2 text-left px-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Bookmark size={17} className="text-gray-500" />
            Lưu bài viết
        </button>
    </div>
}
