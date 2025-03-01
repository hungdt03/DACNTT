import { FC } from "react";
import { SuggestedFriendResource } from "../../types/suggested-friend";
import images from "../../assets";
import { Avatar, Button } from "antd";
import { PlusOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";

type SuggestedFriendProps = {
    suggest: SuggestedFriendResource;
    onAddFriend: () => void;
    onCancel: () => void;
}

const SuggestedFriend: FC<SuggestedFriendProps> = ({
    suggest,
    onAddFriend,
    onCancel
}) => {
    return <div className="flex flex-col rounded-lg overflow-hidden shadow border-[1px] border-gray-100 bg-white">
        <div className="w-full">
            <img src={suggest.user.avatar ?? images.user} style={{
                aspectRatio: 1
            }} className="w-full h-full object-cover border-b-[1px]" />
        </div>

        <div className="flex flex-col gap-y-2 p-4">
            <Link to={`/profile/${suggest.user.id}`} className="text-[16px] font-bold line-clamp-1">{suggest.user.fullName}</Link>
            <span className="text-sm text-gray-500">{suggest.mutualFriends.length} bạn chung</span>
            <Avatar.Group>
                {suggest.mutualFriends.map(friend => <Avatar src={friend.avatar} key={friend.id} />)}
            </Avatar.Group>
            {suggest.isAdd ? <button onClick={onCancel} className="w-full text-center py-[5px] bg-gray-100 hover:bg-gray-200">Hủy lời mời</button> : <Button onClick={onAddFriend} icon={<PlusOutlined />} type="primary">Thêm bạn bè</Button>}
        </div>
    </div>
};

export default SuggestedFriend;
