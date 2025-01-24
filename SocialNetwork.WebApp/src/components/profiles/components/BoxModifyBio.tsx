import { Button, Input } from "antd";
import { FC, useState } from "react";

type BoxModifyBioProps = {
    onCancel: () => void;
    onOk: (bioValue: string) => void;
    loading: boolean;
    initialValue: string;
}

const BoxModifyBio: FC<BoxModifyBioProps> = ({
    onCancel,
    onOk,
    loading,
    initialValue = ''
}) => {
    const [bioValue, setBioValue] = useState(initialValue);

    return <div className="flex flex-col gap-y-2">
        <Input value={bioValue} onChange={e => setBioValue(e.target.value)} placeholder="Mô tả về bạn" className="text-center text-sm" size="large" maxLength={50} showCount />
        <div className="flex justify-end gap-x-2">
            <button onClick={onCancel} className="text-sm px-2 py-[7px] rounded-md bg-gray-100 hover:bg-gray-200">Hủy</button>
            <Button loading={loading} disabled={bioValue.trim().length === 0} onClick={() => onOk(bioValue)} type="primary">Lưu</Button>
        </div>
    </div>
};

export default BoxModifyBio;
