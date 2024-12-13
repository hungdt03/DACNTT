import { FC } from "react";
import ProfileLeftSide from "../components/profiles/ProfileLeftSide";
import ProfileContent from "../components/profiles/ProfileContent";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/slices/auth-slice";

const ProfilePage: FC = () => {
    const { user } = useSelector(selectAuth)
    return <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto w-full grid grid-cols-12 gap-4 h-full lg:h-[90vh] bg-slate-100">
        {user && <ProfileLeftSide user={user}  />}
        {user && <ProfileContent user={user} />}
    </div>
};

export default ProfilePage;
