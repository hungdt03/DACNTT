import { Plus } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

const StoryCreator: FC = () => {
    return <Link to='/story/create' className="flex flex-col h-[200px] rounded-xl overflow-hidden">
        <div className="h-[75%]">
            <img className="h-full object-cover" height='100%' src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/415026176_367351105878728_9160707036274657793_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGbTEdtGKlVJQfRxu_rzcKHnZQwh6N-P12dlDCHo34_Xe8cD09ZBVMoxXYcWoqKajke466jeewyz7TsDyPhYg5F&_nc_ohc=25CwFZ7wAcsQ7kNvgEwFaj7&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=AF91PC9lX5tZGZXKasIQ_S1&oh=00_AYBQzyW6nUOmU6EPNtVMDd85_WX34ls1g_caPIKcCn_zOw&oe=677099E2" />
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
