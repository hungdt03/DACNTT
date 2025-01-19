import { Skeleton } from "antd";
import { FC } from "react";

const CommentSkeleton: FC = () => {
    const skeletonItems = Array.from({ length: 6 }, (_, i) => (
        <div className="flex items-center gap-x-4 w-full" key={i}>
            <Skeleton.Avatar active={true} size="default" shape="circle" />

            <div className="flex-1 flex flex-col gap-y-2">
                <Skeleton.Input
                    className="!flex items-center"
                    active={true}
                    style={{
                        height: '12px',
                    }}
                    size="default"
                />
                <Skeleton.Button style={{
                    height: i % 3 === 0 ? '25px' : i % 3 === 1 ? '45px' : '65px',
                    width: i % 3 === 0 ? '40%' : i % 3 === 1 ? '60%' : '80%',
                }} active={true} size={'large'} shape={'square'} block={true} />
            </div>
        </div>
    ));

    return <div className="flex flex-col gap-y-7 w-full">{skeletonItems}</div>;
};

export default CommentSkeleton;
