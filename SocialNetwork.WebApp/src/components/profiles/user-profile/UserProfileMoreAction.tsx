import { FC } from "react";

type UserProfileMoreActionProps = {
    onBlockUser: () => void;
    onReportUser: () => void
}

const UserProfileMoreAction: FC<UserProfileMoreActionProps> = ({
    onBlockUser,
    onReportUser
}) => {
    return <div className="flex flex-col">
        <button onClick={onBlockUser} className="py-[6px] text-left px-2 w-full hover:bg-gray-100 rounded-md">Chặn</button>
        <button onClick={onReportUser} className="py-[6px] text-left px-2 w-full hover:bg-gray-100 rounded-md">Báo cáo người này</button>
    </div>
};

export default UserProfileMoreAction;
