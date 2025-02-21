import { FC } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/slices/auth-slice";
import { useParams } from "react-router-dom";
import MyProfile from "../components/profiles/my-profile/MyProfile";
import UserProfile from "../components/profiles/user-profile/UserProfile";

const ProfilePage: FC = () => {
    const { id } = useParams();
    const { user } = useSelector(selectAuth);

    return user?.id === id ? <MyProfile /> : id && <UserProfile userId={id} />
};

export default ProfilePage;
