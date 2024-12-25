import { FC, useState } from "react";
import { MixMediaProps } from "./MixMediaProps";
import { isVideo } from "../utils";
import { CloseOutlined } from '@ant-design/icons'                  
import { Modal } from "antd";
import MediaGallery from "../../MediaGallery";
import { MediaType } from "../../../enums/media";

const FiveMedia: FC<MixMediaProps> = ({
    items
}) => {

    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [currentPreview, setCurrentPreview] = useState<number>(1);

    const handlePreview = (index: number) => {
        setCurrentPreview(index);
        setPreviewVisible(true);
    };

    return <>
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
                {items.slice(0, 3).map((item, index) => item.mediaType === MediaType.VIDEO ? (
                    <video
                        key={item.id}
                        src={item.mediaUrl}
                        className="w-full min-h-[200px] object-cover"
                        onClick={() => handlePreview(index)}
                        controls
                    />
                ) : (
                    <img
                        key={item.id}
                        src={item.mediaUrl}
                        className="w-full h-full object-cover"
                        onClick={() => handlePreview(index)}
                    />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {items.slice(3).map((item, index) => item.mediaType === MediaType.VIDEO ? (
                    <video
                        key={item.id}
                        src={item.mediaUrl}
                        className="w-full h-full object-cover"
                        onClick={() => handlePreview(index + 3)}
                        controls
                    />
                ) : (
                    <img
                        key={item.id}
                        src={item.mediaUrl}
                        className="w-full h-full object-cover"
                        onClick={() => handlePreview(index + 3)}
                    />
                ))}
            </div>
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

export default FiveMedia;
