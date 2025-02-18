import { Avatar, Badge, Divider } from "antd";
import { FC } from "react";
import { getTopReactions } from "./StoryContent";
import { CloseOutlined } from '@ant-design/icons'
import { Eye } from "lucide-react";
import { ReactionSvgType, svgReaction } from "../../assets/svg";
import cn from "../../utils/cn";
import { ViewerResource } from "../../types/viewer";
import images from "../../assets";
import { formatTime } from "../../utils/date";

type StoryViewersProps = {
    toggleMore: (show: boolean) => void;
    viewers: ViewerResource[]
}

const StoryViewers: FC<StoryViewersProps> = ({
    toggleMore,
    viewers
}) => {
    return <div className={cn("w-full h-full")}>
        <div className="w-full h-[70px]">
        </div>
        <div className="w-full h-full rounded-t-xl shadow-lg p-4 z-[2100] bg-white">
            <div className="flex items-center justify-between">
                <span></span>
                <span className="font-semibold text-[16px]">Chi tiết về tin</span>
                <button onClick={() => toggleMore(false)}>
                    <CloseOutlined />
                </button>
            </div>
            <Divider className="mb-0 mt-2" />
            <div className="py-4 flex flex-col gap-y-2">
                <div className="flex items-center gap-x-1">
                    <Eye size={17} />
                    <span className="font-bold text-sm text-[16px] text-gray-600">
                        {viewers.length > 0 ? `${viewers.length} người xem` : 'Chưa có người xem'}
                    </span>

                </div>
                <p className="text-gray-500 text-sm">Thông tin chi tiết về những người xem tin của bạn sẽ hiển thị ở đây.</p>

                <div className="flex flex-col gap-y-2">
                    {viewers.map(viewer => <div key={viewer.user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <div className="relative">
                                <Avatar size='default' src={viewer.user.avatar ?? images.user} />
                                {viewer.user.isOnline && <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-white"></div>}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-xs">{viewer.user.fullName}</span>
                                <span className="text-gray-500 text-[11px]"> {viewer.user.isOnline ? 'Đang hoạt động' : `Hoạt động ${formatTime(new Date(viewer.user.recentOnlineTime))}`}</span>

                            </div>
                        </div>

                        <Avatar.Group>
                            {getTopReactions(viewer.reactions, 3).map(reaction =>
                                <Badge size="small" count={reaction.count} key={reaction.reactionType}>
                                    <img width={16} height={16} alt={reaction.reactionType} src={svgReaction[reaction.reactionType as ReactionSvgType]} className="mx-[5px]" />
                                </Badge>
                            )}
                        </Avatar.Group>
                    </div>)}

                </div>
            </div>
        </div>
    </div>
};

export default StoryViewers;
