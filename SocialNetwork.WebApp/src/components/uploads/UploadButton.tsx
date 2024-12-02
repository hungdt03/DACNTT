import { FC } from "react";
import { PlusOutlined } from '@ant-design/icons';

const UploadButton: FC = () => {
    return <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Ảnh/Video</div>
    </button>
}



export default UploadButton;