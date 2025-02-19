import { FC, useEffect, useState } from "react";
import { FriendResource } from "../../../types/friend";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import friendService from "../../../services/friendService";
import MyProfileContent from "./MyProfileContent";
import MyProfileSide from "./MyProfileSide";
import MyProfileHeader from "./MyProfileHeader";
import useTitle from "../../../hooks/useTitle";

const MyProfile: FC = () => {
    const { user } = useSelector(selectAuth);
    const [friends, setFriends] = useState<FriendResource[]>([])

    const fetchFriends = async () => {
        const response = await friendService.getAllMyFriends(1, 9);
        if (response.isSuccess) {
            setFriends(response.data)
        }
    }

 
    useTitle(user?.fullName ?? 'Trang cá nhân')

    useEffect(() => {
        fetchFriends()
    }, [])

    return <div className="flex flex-col h-full w-full overflow-y-auto custom-scrollbar bg-slate-100">
        <div className="bg-white shadow">
            {user && <MyProfileHeader user={user} friends={friends} />}
        </div>
        <div className="w-full h-full xl:max-w-screen-lg lg:max-w-screen-lg lg:px-0 md:max-w-screen-md max-w-screen-sm px-2 mx-auto flex flex-col lg:grid grid-cols-12 lg:gap-4">
            {user && <MyProfileSide friends={friends} />}
            {user && <MyProfileContent user={user} />}
        </div>
    </div>
};

export default MyProfile;
