import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { MoreHorizontal } from "lucide-react";
import { UserResource } from "../../../types/user";
import followService from "../../../services/followService";
import { Empty } from "antd";

type ProfileFollowerListProps = {
    userId: string
}

const ProfileFollowerList: FC<ProfileFollowerListProps> = ({
    userId
}) => {
    const [followers, setFollowers] = useState<UserResource[]>([]);

    const fetchFollowers = async () => {
        const response = await followService.getAllFollowersByUserId(userId);
        if (response.isSuccess) {
            setFollowers(response.data)
        }
    }

    useEffect(() => {
        fetchFollowers()
    }, [])

    return <div className="grid grid-cols-2 gap-4">
        {followers.map(follower => <div key={follower.id} className="flex items-center justify-between p-4 rounded-md border-[1px] border-gray-100">
            <div className="flex items-center gap-x-3">
                <img className="w-[50px] h-[50px] rounded-md border-[1px] border-gray-50" src={follower.avatar ?? images.photo} />
                <div className="flex flex-col">
                    <span className="font-semibold">{follower.fullName}</span>
                </div>
            </div>

            <button className="px-4 py-1 rounded-md bg-sky-100 text-primary font-semibold outline-none border-none">
                Theo dõi
            </button>
        </div>)}

        {followers.length === 0 && <Empty className="col-span-2" description='Chưa có người nào theo dõi bạn' />}
    </div>
};

export default ProfileFollowerList;
