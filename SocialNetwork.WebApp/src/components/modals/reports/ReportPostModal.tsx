import { Input } from "antd";
import { FC } from "react";

type ReportPostModalProps = {
    value: string;
    onChange: (value: string) => void
    title: string;
    description: string;
}

const ReportPostModal: FC<ReportPostModalProps> = ({
    title,
    description,
    value,
    onChange
}) => {
    return <div className="flex flex-col gap-y-2">
        <div>
            <span className="text-[16px] font-bold">{title}</span>
            <p className="text-sm text-gray-600">{description}</p>
        </div>

        <Input.TextArea value={value} onChange={e => onChange(e.target.value)} rows={4} className="w-full" placeholder="Hãy cho chúng tôi biết lí do bạn báo cáo bài viết này">
        </Input.TextArea>

        <button></button>
    </div>
};

export default ReportPostModal;
