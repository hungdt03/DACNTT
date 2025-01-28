import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { MoreHorizontal } from "lucide-react";
import { FriendResource } from "../../../types/friend";
import friendService from "../../../services/friendService";
import { Empty } from "antd";

type ProfileFriendListProps = {
    userId: string
}

const ProfileFriendList: FC<ProfileFriendListProps> = ({
    userId
}) => {
    const [friends, setFriends] = useState<FriendResource[]>([]);

    const fetchFriends = async () => {
        const response = await friendService.getAllFriendsByUserId(userId);
        if (response.isSuccess) {
            setFriends(response.data)
        }
    }

    useEffect(() => {
        fetchFriends()
    }, [])

    return <div className="grid grid-cols-2 gap-4">
        {friends.map(friend => <div key={friend.id} className="flex items-center justify-between p-4 rounded-md border-[1px] border-gray-100">
            <div className="flex items-center gap-x-3">
                <img className="w-[50px] h-[50px] rounded-md border-[1px] border-gray-50" src={friend.avatar ?? images.photo} />
                <div className="flex flex-col">
                    <span className="font-semibold">{friend.fullName}</span>
                    <span className="text-xs text-gray-500">{friend.mutualFriends} bạn chung</span>
                </div>
            </div>

            <button>
                <MoreHorizontal />
            </button>
        </div>)}

        {friends.length === 0 && <Empty className="col-span-2" description='Chưa có bạn bè nào' />}
    </div>
};

export default ProfileFriendList;
