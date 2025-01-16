import { FC } from "react";
import { UserOutlined } from '@ant-design/icons';
import { Skeleton } from "antd";

const StorySkeleton: FC = () => {
    return <Skeleton.Node className="rounded-xl relative" active={true} style={{
        height: '200px',
        width: '125px',
        borderRadius: '10px'
    }}>
        <UserOutlined className="absolute top-4 left-4 border-[4px] border-gray-100 text-gray-100 rounded-full w-10 h-10 flex items-center justify-center" style={{ fontSize: 16 }} />

        <div className="absolute bottom-4 left-4 w-[50%] h-2 bg-gray-100 rounded-xl"></div>
    </Skeleton.Node>
};

export default StorySkeleton;
