import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { UserResource } from "../../../types/user";
import followService from "../../../services/followService";
import { Empty } from "antd";

type ProfileFolloweeListProps = {
    userId: string
}

const ProfileFolloweeList: FC<ProfileFolloweeListProps> = ({
    userId
}) => {
    const [followees, setFollowees] = useState<UserResource[]>([]);

    const fetchFollowers = async () => {
        const response = await followService.getAllFolloweesByUserId(userId);
        if (response.isSuccess) {
            setFollowees(response.data)
        }
    }

    useEffect(() => {
        fetchFollowers()
    }, [])

    return <div className="grid grid-cols-2 gap-4">
        {followees.map(followee => <div key={followee.id} className="flex items-center justify-between p-4 rounded-md border-[1px] border-gray-100">
            <div className="flex items-center gap-x-3">
                <img className="w-[50px] h-[50px] rounded-md border-[1px] border-gray-50" src={followee.avatar ?? images.photo} />
                <div className="flex flex-col">
                    <span className="font-semibold">{followee.fullName}</span>
                </div>
            </div>

            <button className="px-4 py-1 rounded-md bg-sky-100 text-primary font-semibold outline-none border-none">
                Theo dõi
            </button>
        </div>)}

        {followees.length === 0 && <Empty className="col-span-2" description='Bạn chưa theo dõi ai cả' />}
    </div>
};

export default ProfileFolloweeList;
