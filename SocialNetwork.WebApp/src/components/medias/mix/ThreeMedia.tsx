import { FC, useState } from "react";
import { MixMediaProps } from "./MixMediaProps";
import { isVideo } from "../utils";
import { Modal } from "antd";
import { CloseOutlined } from '@ant-design/icons'
import MediaGallery from "../../MediaGallery";

const ThreeMedia: FC<MixMediaProps> = ({
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
            <div className="col-span-1 h-full">
                {isVideo(items[0]) ? (
                    <video
                        src={items[0]}
                        className="w-full h-full object-cover"
                        onClick={() => handlePreview(0)}
                        controls
                    />
                ) : (
                    <img
                        src={items[0]}
                        className="w-full h-full object-cover"
                        onClick={() => handlePreview(0)}
                    />
                )}
            </div>

            <div className="flex flex-col gap-2">
                {items.slice(1).map((item, index) => {
                    return isVideo(item) ? (
                        <video
                            src={item}
                            key={index}
                            className="w-full h-full object-cover"
                            onClick={() => handlePreview(index + 1)}
                            controls
                        />
                    ) : (
                        <img
                            key={index}
                            src={item}
                            alt={`Post Media ${index + 1}`}
                            className="w-full h-full object-cover"
                            onClick={() => handlePreview(index + 1)}
                        />
                    )
                })}
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

export default ThreeMedia;
