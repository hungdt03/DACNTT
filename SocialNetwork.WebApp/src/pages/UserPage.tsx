import { FC, useEffect, useState } from "react";
import ProfileLeftSide from "../components/profiles/ProfileLeftSide";
import ProfileUserHeader from "../components/profiles/ProfileUserHeader";
import { useParams } from "react-router-dom";
import { FriendRequestResource } from "../types/friendRequest";
import { UserResource } from "../types/user";
import friendRequestService from "../services/friendRequestService";
import userService from "../services/userService";
import Loading from "../components/Loading";
import SignalRConnector from '../app/signalR/signalr-connection'
import { NotificationResource } from "../types/notification";
import { NotificationType } from "../constants/notification-type";

const UserPage: FC = () => {
    const { id } = useParams();
    const [friendRequest, setFriendRequest] = useState<FriendRequestResource | null>(null)
    const [user, setUser] = useState<UserResource | null>(null)
    const [loading, setLoading] = useState(false)
    const { events } = SignalRConnector()

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

        id && fetchData(id);
    }, [id]);

    useEffect(() => {
        events(undefined, (notification: NotificationResource) => {
            if(notification.type === NotificationType.FRIEND_REQUEST_SENT || notification.type === NotificationType.FRIEND_REQUEST_ACCEPTED) {
                id && fetchFriendRequestData(id)
            }
        })
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

    return <div className="w-full flex flex-col gap-y-4 h-full bg-slate-100">
        {loading && <Loading />}
        {id && user && <ProfileUserHeader onRefresh={() => fetchFriendRequestData(id)} user={user} friendRequest={friendRequest} />}
        <div className="flex flex-col h-full gap-y-4 lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto">
            <div className="grid grid-cols-12 gap-6 h-full">
                <ProfileLeftSide />
                {/* <ProfilePostList /> */}
            </div>
        </div >
    </div>
};

export default UserPage;
