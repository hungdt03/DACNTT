import { FC } from "react";

const PostNotFound: FC = () => {
    return <div className="flex flex-col gap-y-2 bg-white rounded-xl overflow-hidden border-[1px] border-gray-200 px-4 py-6">
        <p className="text-sm">Bài viết có thể đã bị chủ sở hữu xóa</p>
    </div>
};

export default PostNotFound;
