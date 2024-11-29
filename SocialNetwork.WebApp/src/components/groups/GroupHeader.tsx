import { FC } from "react";
import images from "../../assets";
import { Avatar, Button, Divider } from "antd";
import { Plus } from "lucide-react";

const GroupHeader: FC = () => {
    return <div className="bg-white w-full shadow">
        <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto overflow-hidden">
            <img className="w-full object-cover max-h-[40vh] rounded-b-xl" src={images.coverGroup} />
            <div className="py-4 flex flex-col gap-y-2">
                <span className="font-bold text-3xl">Share đáp án TDTU</span>
                <div className="flex items-center gap-x-3">
                    <span className="text-gray-500">Nhóm riêng tư</span>
                    <span className="font-semibold text-gray-500">33.5k thành viên</span>
                </div>

                <div className="flex md:flex-row flex-col items-start gap-4 md:gap-0 md:items-center justify-between">
                    <Avatar.Group>
                        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                        <a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a><a href="https://ant.design">
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </a>
                    </Avatar.Group>

                    <div className="flex items-center gap-x-2">
                        <Button icon={<Plus size={16} />} type='primary'>Mời</Button>
                        <button className="bg-sky-50 text-primary px-3 py-1 rounded-md">Đã tham gia</button>
                    </div>
                </div>

                <Divider className="my-3" />
            </div>
        </div>
    </div>
};

export default GroupHeader;
