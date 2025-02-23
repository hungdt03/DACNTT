import { FC } from "react";
import { UserResource } from "../../../types/user";
import { Avatar, Button } from "antd";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

type ReportUserItemProps = {
    user: UserResource
}

const ReportUserItem: FC<ReportUserItemProps> = ({
    user
}) => {
    return  <div className="flex flex-col gap-y-2">
    <div className="flex items-center gap-x-3">
        <Avatar size={'large'} src={user.avatar} />
        <div className="flex flex-col gap-y-1">
            <span className="font-semibold">{user.fullName}</span>
        </div>
    </div>
    <div className="flex items-center justify-end gap-x-3">
        <Link to={`/admin/users/${user.id}`}>
            <Button icon={<Eye size={14} />} type="primary">
                Xem trang
            </Button>
        </Link>
        {/* <Button onClick={onKeep} type="primary">Giữ lại</Button>
        <button onClick={onRemove} className="py-[6px] text-sm px-4 rounded-md hover:bg-gray-200 bg-gray-100">Xóa khỏi nhóm</button> */}
    </div>
</div>
};

export default ReportUserItem;
