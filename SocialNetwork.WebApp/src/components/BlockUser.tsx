import { Avatar } from "antd";
import { FC } from "react";
import { UserResource } from "../types/user";
import images from "../assets";

type BlockUserProps = {
    user: UserResource;
    unBlockUser: () => void;
}

const BlockUser: FC<BlockUserProps> = ({
    user,
    unBlockUser
}) => {
    return <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
            <Avatar size={'large'} src={user.avatar ?? images.user} />
            <span className="text-[15px] font-bold">{user.fullName}</span>
        </div>

        <button onClick={unBlockUser} className="px-3 py-[5px] rounded-md bg-gray-100 hover:bg-gray-200">Bỏ chặn</button>
    </div>
};

export default BlockUser;
