import { UserGroupIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { GroupMemberResource } from "../../../types/group-member";
import { GroupResource } from "../../../types/group";

type GroupMemberLeftSideProps = {
    member: GroupMemberResource;
    group: GroupResource
}

const GroupMemberLeftSide: FC<GroupMemberLeftSideProps> = ({
    member,
    group
}) => {
    return <div className="col-span-5 h-full overflow-y-auto scrollbar-hide flex flex-col gap-y-2 lg:gap-y-4">
        <div className="p-4 rounded-md bg-white shadow flex flex-col gap-y-2">
            <span className="text-lg font-bold">Giới thiệu</span>
            <div className="flex flex-col items-center gap-y-3">
                <img className="w-[80px] h-[80px] object-cover rounded-full" src={member.user.avatar} />
                <span className="text-xl font-bold">{member.user.fullName}</span>
            </div>
            <div className="flex items-start gap-x-3">
                <UserGroupIcon width={25} className="flex-shrink-0" color="gray" />
                <span>
                    Quản trị viên của {group.name} từ ngày 18 tháng 7, 2024
                </span>
            </div>
        </div>

        <div className="p-4 rounded-md bg-white shadow flex flex-col gap-y-2">
            <span className="text-lg font-bold">Ảnh gần đây</span>

            <div className="flex items-start gap-x-3">
                <UserGroupIcon width={25} className="flex-shrink-0" color="gray" />
                <span>
                    Quản trị viên của CHIẾN TRANH VIỆT NAM VÀ NHỮNG CÂU CHUYỆN!!! từ ngày 18 tháng 7, 2024
                </span>
            </div>
        </div>

        <div className="p-4 rounded-md bg-white shadow flex flex-col gap-y-2">
            <span className="text-lg font-bold">Hoạt động gần đây</span>

            <div className="flex items-start gap-x-3">
                <UserGroupIcon width={25} className="flex-shrink-0" color="gray" />
                <span>
                    Quản trị viên của CHIẾN TRANH VIỆT NAM VÀ NHỮNG CÂU CHUYỆN!!! từ ngày 18 tháng 7, 2024
                </span>
            </div>
        </div>
    </div>
};

export default GroupMemberLeftSide;
