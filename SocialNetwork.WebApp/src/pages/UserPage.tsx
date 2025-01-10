import { FC, useEffect, useState } from "react";
import ProfileLeftSide from "../components/profiles/ProfileLeftSide";
import { useNavigate, useParams } from "react-router-dom";
import { FriendRequestResource } from "../types/friendRequest";
import { UserResource } from "../types/user";
import friendRequestService from "../services/friendRequestService";
import userService from "../services/userService";
import Loading from "../components/Loading";
import SignalRConnector from '../app/signalR/signalr-connection'
import { NotificationResource } from "../types/notification";
import { NotificationType } from "../enums/notification-type";
import ProfileUserContent from "../components/profiles/ProfileUserContent";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/slices/auth-slice";
import { FriendResource } from "../types/friend";
import friendService from "../services/friendService";

const UserPage: FC = () => {
    const { id } = useParams();
    const { user: currentUser } = useSelector(selectAuth)
    const [friendRequest, setFriendRequest] = useState<FriendRequestResource | null>(null)
    const [user, setUser] = useState<UserResource | null>(null)
    const [loading, setLoading] = useState(false)
    const [friends, setFriends] = useState<FriendResource[]>([])
    const navigate = useNavigate()


    const fetchFriends = async (userId: string) => {
        const response = await friendService.getTopNineOfUserFriends(userId);
        if (response.isSuccess) {
            setFriends(response.data)
        }
    }

    useEffect(() => {
        id && fetchFriends(id)
    }, [id])

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

        id && id === currentUser?.id && navigate('/profile')

        id && fetchData(id);


    }, [id]);

    useEffect(() => {
        SignalRConnector.events(
            undefined,
            undefined,
            undefined,
            undefined,
            (notification: NotificationResource) => {
                if(notification.type === NotificationType.FRIEND_REQUEST_SENT || notification.type === NotificationType.FRIEND_REQUEST_ACCEPTED) {
                    id && fetchFriendRequestData(id)
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
        {user && <ProfileLeftSide friends={friends} />}
        {id && user && <ProfileUserContent  friends={friends} onRefresh={() => fetchFriendRequestData(id)} user={user} friendRequest={friendRequest} />}
    </div>
};

export default UserPage;
