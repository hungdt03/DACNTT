import { Skeleton } from "antd";
import { FC } from "react";

const PostSkeleton: FC = () => {
    return <div className="p-4 rounded-xl bg-white shadow-sm h-64 flex flex-col justify-between">
        <div className="flex gap-x-2 items-start">
            <Skeleton.Avatar size="large" active />
            <div className="flex flex-col relative top-1">
                <Skeleton.Button active style={{
                    width: 80,
                    height: 9,
                    margin: 0
                }} size="small" />
                <Skeleton.Button active style={{
                    width: 120,
                    height: 9,
                    margin: 0
                }} size="small" />
            </div>
        </div>

        <div className="flex justify-around">
            <Skeleton.Button active style={{
                width: 50,
                height: 8
            }} size="small" />
            <Skeleton.Button active style={{
                width: 50,
                height: 8
            }} size="small" />
            <Skeleton.Button active style={{
                width: 50,
                height: 8
            }} size="small" />
        </div>
    </div>
};

export default PostSkeleton;
