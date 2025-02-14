import { FC, useState } from "react";
import {Tabs, TabsProps } from "antd";
import ProfilePostList from "../shared/ProfilePostList";
import { UserResource } from "../../../types/user";
import ProfileFriendList from "../shared/ProfileFriendList";
import ProfileFollowerList from "../shared/ProfileFollowerList";
import ProfileFolloweeList from "../shared/ProfileFolloweesList";
import ProfileVideoList from "../shared/ProfileVideoList";
import ProfileImageList from "../shared/ProfileImageList";

type ProfileUserContentProps = {
    user: UserResource;
}

const ProfileUserContent: FC<ProfileUserContentProps> = ({
    user: targetUser,
}) => {
    const [activeKey, setActiveKey] = useState<string>('1');
   
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Bài viết',
            children: <ProfilePostList user={targetUser} />,
        },
        {
            key: '2',
            label: 'Bạn bè',
            children: <ProfileFriendList userId={targetUser.id} />,
        },
        {
            key: '3',
            label: 'Ảnh',
            children: <ProfileImageList userId={targetUser.id} isMe={false} />,
        },
        {
            key: '4',
            label: 'Video',
            children: <ProfileVideoList userId={targetUser.id} isMe={false} />,
        },
        {
            key: '5',
            label: 'Người theo dõi',
            children: <ProfileFollowerList userId={targetUser.id} />,
        },
        {
            key: '6',
            label: 'Đang theo dõi',
            children: <ProfileFolloweeList userId={targetUser.id} />,
        },

    ];


    return <div className="bg-transparent w-full lg:h-full lg:col-span-7 lg:overflow-y-auto lg:scrollbar-hide py-0 md:py-4">
        <Tabs onChange={(key) => setActiveKey(key)} activeKey={activeKey} className="bg-white p-2 md:p-4 rounded-lg" items={items} />
    </div>

};

export default ProfileUserContent;
