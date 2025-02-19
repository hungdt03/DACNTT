import { FC, useEffect, useState } from "react";
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
import UserProfileContent from "./UserProfileContent";
import UserProfileSide from "./UserProfileSide";
import UserProfileHeader from "./UserProfileHeader";
import { Role } from "../../../enums/role";
import { useNavigate } from "react-router-dom";
import useTitle from "../../../hooks/useTitle";

type UserProfileProps = {
    userId: string
}

const UserProfile: FC<UserProfileProps> = ({
    userId
}) => {
    const [friendRequest, setFriendRequest] = useState<FriendRequestResource | null>(null)
    const [user, setUser] = useState<UserResource | null>(null)
    const [loading, setLoading] = useState(false)
    const [friends, setFriends] = useState<FriendResource[]>([]);
    const navigate = useNavigate();

    const fetchFriends = async (userId: string) => {
        const response = await friendService.getAllFriendsByUserId(userId, 1, 9);
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

    useTitle(user?.fullName ?? 'Trang cá nhân')

    useEffect(() => {
        SignalRConnector.events(
            undefined,
            undefined,
            undefined,
            undefined,
            (notification: NotificationResource) => {
                if (notification.type === NotificationType.FRIEND_REQUEST_SENT || notification.type === NotificationType.FRIEND_REQUEST_ACCEPTED) {
                    fetchFriendRequestData(userId)
                }
            },
            (_) => fetchUserData(userId)
        )

    }, [userId])

    const fetchUserData = async (userId: string) => {
        try {
            const userResponse = await userService.getUserById(userId);
            if (userResponse.isSuccess) {
                if(userResponse.data.role == Role.ADMIN) {
                    navigate('/404')
                }
                setUser(userResponse.data);
            } else {
                navigate('/404')
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

    return <div className="flex flex-col h-full w-full overflow-y-auto custom-scrollbar bg-slate-100">
        {loading && <Loading title="Đang tải thông tin..." />}
        <div className="bg-white shadow">
            {user && <UserProfileHeader 
                friendRequest={friendRequest} 
                onRefresh={() => fetchFriendRequestData(userId)}  
                user={user} 
                friends={friends}
            />}
        </div>
        <div className="w-full h-full xl:max-w-screen-lg lg:max-w-screen-lg lg:px-0 md:max-w-screen-md max-w-screen-sm px-2 mx-auto flex flex-col lg:grid grid-cols-12 lg:gap-4">
            {user && <UserProfileSide user={user} friends={friends} />}
            {user && <UserProfileContent user={user} />}
        </div>
    </div>
};

export default UserProfile;
