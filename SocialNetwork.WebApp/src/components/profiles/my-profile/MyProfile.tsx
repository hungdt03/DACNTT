import { FC, useEffect, useState } from "react";
import { FriendResource } from "../../../types/friend";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import friendService from "../../../services/friendService";
import ProfileContent from "../ProfileContent";
import ProfileLeftSide from "../ProfileLeftSide";

const MyProfile: FC = () => {
    const { user } = useSelector(selectAuth);
    const [friends, setFriends] = useState<FriendResource[]>([])

    const fetchFriends = async () => {
        const response = await friendService.getTopNineOfMyFriends();
        if (response.isSuccess) {
            setFriends(response.data)
        }
    }

    useEffect(() => {
        fetchFriends()
    }, [])
    
    return <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:px-0 md:max-w-screen-md max-w-screen-sm px-4 mx-auto w-full grid grid-cols-12 gap-4 h-full lg:h-[90vh] bg-slate-100">
        {user && <ProfileContent friends={friends} user={user} />}
        {user && <ProfileLeftSide friends={friends} />}
    </div>
};

export default MyProfile;
