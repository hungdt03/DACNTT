import { FC, useState } from "react";
import { isVideo } from "../utils";
import { MixMediaProps } from "./MixMediaProps";
import { Modal } from "antd";
import { CloseOutlined } from '@ant-design/icons'
import MediaGallery from "../../MediaGallery";

const TwoMedia: FC<MixMediaProps> = ({
    items
}) => {
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [currentPreview, setCurrentPreview] = useState<number>(1);

    const handlePreview = (index: number) => {
        setCurrentPreview(index);
        setPreviewVisible(true);
    };

    return <>
        <div className="grid grid-cols-2 gap-2">
            {items.map((item, index) => {
                return isVideo(item) ? (
                    <video
                        src={item}
                        className="w-full h-full object-cover"
                        onClick={() => handlePreview(index)}
                        controls
                    />
                ) : (
                    <img
                        src={item}
                        alt={`Post Media ${index + 1}`}
                        className="w-full h-full object-cover"
                        onClick={() => handlePreview(index)}
                    />
                )
            })}
        </div>

        {previewVisible && <button
            onClick={() => setPreviewVisible(false)}
            className="fixed top-10 right-10 z-[8000] font-bold bg-gray-800 bg-opacity-35 w-10 h-10 flex items-center justify-center rounded-full"
        >
            <CloseOutlined className="text-white z-[10000]" />
        </button>}

        <Modal
            open={previewVisible}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            centered
            className="custom-modal"
            styles={{
                body: {
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                },
                mask: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                wrapper: {
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                },
                content: {
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                    boxShadow: 'none'
                },
            }}
            width={900}
        >
            <MediaGallery medias={items} currentPreview={currentPreview} />
        </Modal>
    </>
};

export default TwoMedia;
