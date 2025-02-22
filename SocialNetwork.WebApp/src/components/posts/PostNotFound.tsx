import { FC } from "react";
import errors from "../../assets/error";

const PostNotFound: FC = () => {
    return <div className="flex flex-col items-center gap-y-2 bg-white rounded-xl overflow-hidden border-[1px] border-gray-200 px-4 py-6">
        <img className="w-[50px] h-[50px] object-cover" src={errors.postNotFound} />
        <p className="text-sm">Bài viết không còn nữa hoặc có thể đã bị chủ sở hữu xóa</p>
    </div>
};

export default PostNotFound;
