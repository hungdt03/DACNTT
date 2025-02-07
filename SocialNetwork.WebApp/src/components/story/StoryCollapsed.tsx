import { ChevronUp } from "lucide-react";
import { ViewerResource } from "../../types/viewer";
import { Avatar } from "antd";
import { ChevronDoubleUpIcon } from "@heroicons/react/24/outline";

interface StoryCollapsedProps {
    isFetch: boolean;
    viewers: ViewerResource[]
    toggleMore: (show: boolean) => void;
}

const StoryCollapsed: React.FC<StoryCollapsedProps> = ({ isFetch, viewers, toggleMore }) => {
    return isFetch ? <div onClick={() => toggleMore(true)} className="cursor-pointer relative pl-2 py-2">
        {
            viewers.length === 0 ? <button  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }} className="text-white text-sm">
                <ChevronUp size={16} />
                Chưa có người xem
            </button> : viewers.length > 0 && <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2" >
                    <span  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }} className="text-white font-bold text-sm pb-[2px] border-b-[1px] border-gray-200">{viewers.length} người xem</span>
                    <ChevronUp size={16} strokeWidth={3} className="mb-1" color="white" />
                </div>
                <Avatar.Group>
                    {viewers.map(viewer => <img className="mx-[2px] w-[28px] h-[28px] rounded-full object-cover border-[2px] border-white" key={viewer.user.id} src={viewer.user.avatar} />)}
                </Avatar.Group>
            </div>
        }
        <div
            className="absolute inset-0 z-0"
            style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))'
            }}
        />
    </div>
        : <div className="relative flex flex-col items-center">
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))'
                }}
            />
            <button onClick={() => toggleMore(true)} className="text-white text-sm flex items-center gap-x-1 py-3 z-50">
                Phản hồi
                <ChevronDoubleUpIcon width={20} height={20} className="-mt-[2px]" />
            </button>
        </div>
}

export default StoryCollapsed;