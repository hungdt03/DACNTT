import { Skeleton } from "antd";
import { FC } from "react";

const NotificationSkeleton: FC = () => {
    const skeletonItems = Array.from({ length: 3 }, (_, i) => (
        <div className="flex items-center gap-x-4 w-full" key={i}>
            <Skeleton.Avatar active={true} size="small" shape="circle" />
            <div className="flex-1 flex flex-col gap-y-2">
                <Skeleton.Input
                    className="flex-1 !flex items-center"
                    active={true}
                    style={{
                        height: '12px',
                        width: i % 3 === 0 ? '40%' : i % 3 === 1 ? '60%' : '80%',
                    }}
                    size="small"
                />
                <Skeleton.Input
                    className="!flex items-center"
                    active={true}
                    style={{
                        height: '12px',
                        width: i % 3 === 0 ? '40%' : i % 3 === 1 ? '60%' : '80%',
                    }}
                    size="small"
                />

            </div>
        </div>
    ));

    return <div className="flex flex-col gap-y-7 w-full px-4">{skeletonItems}</div>;
};

export default NotificationSkeleton;
