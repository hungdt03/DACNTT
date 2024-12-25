import { Button, Divider } from "antd";
import { FC } from "react";
import { CloseOutlined, SettingOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import images from "../../assets";
import TextEditor from "./TextEditor";

const CreateStorySidebar: FC = () => {
    return <div className="flex flex-col shadow h-full">
        <div className="flex items-center gap-x-2 p-3">
            <Button shape="circle" icon={<CloseOutlined />}>
            </Button>
            <Link to='/'><img width='36px' height='36px' src={images.facebook} /></Link>
        </div>
        <Divider className="my-0" />
            <div className="flex flex-col gap-y-4 py-5 px-3">
                <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold">Tin của bạn</span>
                    <Button shape="circle" icon={<SettingOutlined />}></Button>
                </div>
                <div className="flex items-center gap-x-3">
                    <img width={45} src={images.user} />
                    <span className="font-semibold text-lg">Đạo Thanh Hưng</span>
                </div>
            </div>
        <Divider />

        <div className="p-3">
            <TextEditor />
        </div>
    </div>
};

export default CreateStorySidebar;
