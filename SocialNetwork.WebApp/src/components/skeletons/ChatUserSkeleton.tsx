import { Skeleton } from "antd";
import { FC } from "react";

const ChatUserSkeleton: FC = () => {
    return <div className="flex flex-col gap-y-2 w-full">
        <Skeleton avatar active paragraph={{ rows:0 }} style={{
            width: 300
        }} />
        <Skeleton avatar active paragraph={{ rows:0 }} style={{
            width: 300
        }} />
        <Skeleton avatar active paragraph={{ rows:0 }} style={{
            width: 300
        }} />
        <Skeleton avatar active paragraph={{ rows:0 }} style={{
            width: 300
        }} />
        <Skeleton avatar active paragraph={{ rows:0 }} style={{
            width: 300
        }} />
        <Skeleton avatar active paragraph={{ rows:0 }} style={{
            width: 300
        }} />
        <Skeleton avatar active paragraph={{ rows:0 }} style={{
            width: 300
        }} />
    </div>
};

export default ChatUserSkeleton;
