import { Plus } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

const CreateStoryArea: FC = () => {
    return <div className="p-2 rounded-md bg-white shadow">
        <Link to='/stories/create' className="flex items-center gap-x-3 p-2 hover:bg-gray-50">
            <button className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 text-primary flex items-center justify-center">
                <Plus size={18} strokeWidth={2} />
            </button>

            <div className="flex flex-col">
                <span className="text-sm md:text-[16px] font-bold">Tạo tin</span>
                <p className="text-gray-500 text-[13px] md:text-sm">Bạn có thể chia sẻ ảnh hoặc viết gì đó</p>
            </div>
        </Link>
    </div>
};

export default CreateStoryArea;
