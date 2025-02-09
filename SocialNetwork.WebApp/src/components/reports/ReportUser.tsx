import { FC } from "react";
import { ReportResource } from "../../types/report";
import { Button } from "antd";

type ReportUserProps = {
    report: ReportResource
    onKeep: () => void;
    onRemove: () => void;
}

const ReportUser: FC<ReportUserProps> = ({
    report,
    onKeep,
    onRemove
}) => {
    return <div>
        <div className="flex items-center justify-end gap-x-3">
            <Button onClick={onKeep} type="primary">Bỏ qua</Button>
            <button onClick={onRemove} className="py-[6px] text-sm px-4 rounded-md hover:bg-gray-200 bg-gray-100">Xóa khỏi nhóm</button>
        </div>
    </div>
};

export default ReportUser;
