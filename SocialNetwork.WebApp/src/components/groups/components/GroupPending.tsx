import { Avatar, Divider, Tooltip } from "antd";
import { FC } from "react";
import { GroupResource } from "../../../types/group";
import { BookA, Calendar, Eye, Lock, Users2Icon, UsersRoundIcon } from "lucide-react";
import { formatTime } from "../../../utils/date";

type GroupPendingProps = {
    group: GroupResource
}

const GroupPending: FC<GroupPendingProps> = ({
    group
}) => {
    return <div className="grid grid-cols-12 gap-6 overflow-y-auto py-6">
        <div className="col-span-7 shadow p-4 rounded-xl border-[1px]  bg-white border-gray-100">
            <span className="font-bold text-lg">Giới thiệu về nhóm này</span>
            <Divider className="my-3" />
            <div className="flex flex-col gap-y-2">
                <p className="break-words text-[16px]">{group.description}</p>
                <div className="flex items-center gap-x-4">
                    <Lock size={16} className="text-gray-500" />
                    <div className="flex flex-col gap-y-1">
                        <span className="font-bold">Riêng tư</span>
                        <p className="break-words text-[15px]">Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.</p>
                    </div>
                </div>

                <div className="flex items-center gap-x-4">
                    <Eye size={16} className="text-gray-500" />
                    <div className="flex flex-col gap-y-1">
                        <span className="font-bold">Hiển thị</span>
                        <p className="break-words text-[15px]">Ai cũng có thể tìm thấy nhóm này.</p>
                    </div>
                </div>

            </div>
        </div>
        <div className="col-span-5 shadow p-4 rounded-xl border-[1px] border-gray-100 bg-white">
            <span className="font-bold text-lg">Hoạt động</span>
            <Divider className="my-3" />
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-4">
                    <BookA size={16} className="text-gray-500" />
                    <p className="break-words text-[15px]">Hôm nay có {group.countTodayPosts} bài viết mới</p>
                </div>

                <div className="flex items-center gap-x-4">
                    <Users2Icon size={16} className="text-gray-500" />
                    <p className="break-words text-[15px]">Tổng cộng {group.members.length} thành viên</p>
                </div>

                <div className="flex items-center gap-x-4">
                    <UsersRoundIcon size={16} className="text-gray-500" />
                    <div>
                        <p className="break-words text-[15px]">Bạn bè: </p>
                        <Avatar.Group>
                            {group.friendMembers.map(member =>
                                <Tooltip key={member.id} title={member.fullName}>
                                    <Avatar  src={member.avatar} size={'small'} />
                                </Tooltip>
                            )}
                        </Avatar.Group>
                    </div>
                </div>


                <div className="flex items-center gap-x-4">
                    <Calendar size={16} className="text-gray-500" />
                    <p className="break-words text-[15px]">Ngày tạo: {formatTime(new Date(group.dateCreated))}</p>
                </div>

            </div>
        </div>
    </div>
};

export default GroupPending;
