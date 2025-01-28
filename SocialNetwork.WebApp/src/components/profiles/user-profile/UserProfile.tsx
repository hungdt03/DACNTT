import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectAuth } from "../../../features/slices/auth-slice";
import { FriendRequestResource } from "../../../types/friendRequest";
import { UserResource } from "../../../types/user";
import { FriendResource } from "../../../types/friend";
import friendService from "../../../services/friendService";
import SignalRConnector from '../../../app/signalR/signalr-connection'
import { NotificationType } from "../../../enums/notification-type";
import { NotificationResource } from "../../../types/notification";
import userService from "../../../services/userService";
import friendRequestService from "../../../services/friendRequestService";
import Loading from "../../Loading";
import ProfileUserContent from "../ProfileUserContent";
import UserProfileSide from "./UserProfileSide";

type UserProfileProps = {
    userId: string
}

const UserProfile: FC<UserProfileProps> = ({
    userId
}) => {
    const [friendRequest, setFriendRequest] = useState<FriendRequestResource | null>(null)
    const [user, setUser] = useState<UserResource | null>(null)
    const [loading, setLoading] = useState(false)
    const [friends, setFriends] = useState<FriendResource[]>([])


    const fetchFriends = async (userId: string) => {
        const response = await friendService.getTopNineOfUserFriends(userId);
        if (response.isSuccess) {
            setFriends(response.data)
        }
    }

    useEffect(() => {
        fetchFriends(userId)
    }, [userId])

    useEffect(() => {
        const fetchData = async (userId: string) => {
            setLoading(true);
            try {
                await Promise.all([fetchUserData(userId), fetchFriendRequestData(userId)]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData(userId);
    }, [userId]);

    useEffect(() => {
        SignalRConnector.events(
            undefined,
            undefined,
            undefined,
            undefined,
            (notification: NotificationResource) => {
                if(notification.type === NotificationType.FRIEND_REQUEST_SENT || notification.type === NotificationType.FRIEND_REQUEST_ACCEPTED) {
                    fetchFriendRequestData(userId)
                }
            }
        )
       
    }, [])

    const fetchUserData = async (userId: string) => {
        try {
            const userResponse = await userService.getUserById(userId);
            if (userResponse.isSuccess) {
                setUser(userResponse.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchFriendRequestData = async (userId: string) => {
        try {
            const friendRequestResponse = await friendRequestService.getFriendRequestByUserId(userId);
            if (friendRequestResponse.isSuccess) {
                setFriendRequest(friendRequestResponse.data);
            } else {
                setFriendRequest(null)
            }
        } catch (error) {
            console.error("Error fetching friend request data:", error);
        }
    };

    return <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto w-full grid grid-cols-12 gap-4 h-full lg:h-[90vh] bg-slate-100">
        {loading && <Loading />}
        {user && <UserProfileSide user={user} friends={friends} />}
        {user && <ProfileUserContent  friends={friends} onRefresh={() => fetchFriendRequestData(userId)} user={user} friendRequest={friendRequest} />}
    </div>
};

export default UserProfile;
