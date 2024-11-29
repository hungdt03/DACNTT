import { FC } from "react";
import GroupHeader from "../components/groups/GroupHeader";
import GroupRightSide from "../components/groups/GroupRightSide";
import GroupPostList from "../components/groups/GroupPostList";

const GroupPage: FC = () => {
    return <div className="w-full flex flex-col gap-y-4 h-full bg-slate-100">
        <GroupHeader />
        <div className="flex flex-col h-full gap-y-4 lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto">
            <div className="grid grid-cols-12 gap-6 h-full">
                <GroupPostList />
                <GroupRightSide />
            </div>
        </div >
    </div>
}

export default GroupPage;
