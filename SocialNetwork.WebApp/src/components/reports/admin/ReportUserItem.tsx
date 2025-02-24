import { FC } from "react";
import { UserResource } from "../../../types/user";
import { Avatar, Button } from "antd";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import PostNotFound from "../../posts/PostNotFound";

type ReportUserItemProps = {
    user: UserResource
}

const ReportUserItem: FC<ReportUserItemProps> = ({
    user
}) => {

    if(user === null) return <PostNotFound title='Người dùng không tồn tại hoặc đã bị xóa' />

    return <div className="flex flex-col gap-y-2 shadow bg-white rounded-md p-4">
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

        </div>
    </div>
};

export default ReportUserItem;
