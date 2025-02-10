import { FC } from "react";
import { FriendRequestResource } from "../../types/friendRequest";
import images from "../../assets";
import { Button } from "antd";
import { CheckOutlined } from '@ant-design/icons'

type RequestFriendProps = {
    request: FriendRequestResource;
    onAccept: () => void;
    onReject: () => void;
}

const RequestFriend: FC<RequestFriendProps> = ({
    request,
    onAccept,
    onReject
}) => {
    return <div className="flex flex-col rounded-lg overflow-hidden shadow border-[1px] border-gray-100 bg-white">
        <div className="w-full">
            <img src={request.sender.avatar ?? images.user} style={{
                aspectRatio: 1
            }} className="w-full h-full object-cover border-b-[1px]" />
        </div>

        <div className="flex flex-col gap-y-2 p-4">
            <span className="text-[16px] font-bold">{request.sender.fullName}</span>
            <span className="text-sm text-gray-500">5 bạn chung</span>
            <button onClick={onReject} className="w-full text-center py-[5px] rounded-md bg-gray-100 hover:bg-gray-200">Gỡ lời mời</button>
            <Button onClick={onAccept} icon={<CheckOutlined />} type="primary">Chấp nhận</Button>
        </div>
    </div>
};

export default RequestFriend;
