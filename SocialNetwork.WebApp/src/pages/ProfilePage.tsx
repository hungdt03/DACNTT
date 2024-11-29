import { FC } from "react";
import ProfileHeader from "../components/profiles/ProfileHeader";
import ProfilePostList from "../components/profiles/ProfilePostList";
import ProfileLeftSide from "../components/profiles/ProfileLeftSide";

const ProfilePage: FC = () => {
    return <div className="w-full flex flex-col gap-y-4 h-full bg-slate-100">
        <ProfileHeader />
        <div className="flex flex-col h-full gap-y-4 lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto">
            <div className="grid grid-cols-12 gap-6 h-full">
                <ProfileLeftSide />
                <ProfilePostList />
            </div>
        </div >
    </div>
};

export default ProfilePage;
