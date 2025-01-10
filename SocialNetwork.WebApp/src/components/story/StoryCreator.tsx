import { Plus } from "lucide-react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAuth } from "../../features/slices/auth-slice";

const StoryCreator: FC = () => {
    const { user } = useSelector(selectAuth)
    return <Link to='/story/create' className="flex flex-col h-[200px] rounded-xl overflow-hidden">
        <div className="h-[75%] relative">
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))'
                }}
            />
            <img className="w-full h-full object-cover" height='100%' src={user?.avatar} />
        </div>
        <div className="h-[25%] bg-white relative flex items-center justify-center">
            <button className="absolute -top-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white p-[6px] rounded-full border-[4px] border-white">
                <Plus size={18} />
            </button>
            <span className="text-center text-sm font-semibold">Tạo tin</span>
        </div>
    </Link>
};

export default StoryCreator;
