import { Button, Checkbox, Divider } from "antd";
import { FC } from "react";

const GroupSettingModal: FC = () => {
    return <div className="flex flex-col gap-y-2">
        <Divider className="mt-0">Cấu hình</Divider>
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <span className="text-[15px]">Phê duyệt thành viên vào nhóm</span>
                <Checkbox />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[15px]">Phê duyệt bài viết</span>
                <Checkbox />
            </div>
            <div className="flex justify-end">
                <Button type="primary">Lưu lại</Button>
            </div>
        </div>
        <Divider className="mt-0">Nhóm trưởng</Divider>
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <span className="text-[15px]">Phê duyệt thành viên vào nhóm</span>
                <Checkbox />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[15px]">Phê duyệt bài viết</span>
                <Checkbox />
            </div>
            <div className="flex justify-end">
                <Button type="primary">Lưu lại</Button>
            </div>
        </div>
    </div>
};

export default GroupSettingModal;
