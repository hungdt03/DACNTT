import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/slices/auth-slice";
import { useParams } from "react-router-dom";
import MyProfile from "../components/profiles/my-profile/MyProfile";
import UserProfile from "../components/profiles/user-profile/UserProfile";
import userService from "../services/userService";
import NotAllowedComponent from "../components/NotAllowedComponent";
import Loading from "../components/Loading";

const ProfilePage: FC = () => {
    const { id } = useParams();
    const { user } = useSelector(selectAuth);
    const [isBlockUser, setIsBlockUser] = useState<boolean>();
    const [loading, setLoading] = useState(false)

    const fetchIsBlockUser = async (userId: string) => {
        setLoading(true)
        const response = await userService.checkBlockUser(userId);
        setLoading(false)
        if(response.isSuccess) {
            setIsBlockUser(response.data)
        }
    }

    useEffect(() => {
        id && fetchIsBlockUser(id)
    }, [id])

    return <>
        {loading && <Loading />}
        {!loading && (user?.id === id ? <MyProfile /> : id && (!isBlockUser && !loading) ? <UserProfile userId={id} /> : <NotAllowedComponent />)}
    </>
};

export default ProfilePage;
