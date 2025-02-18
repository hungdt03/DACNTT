import { FC, useState } from "react";
import { MessageMediaResource } from "../../../../types/message";
import MediaGallery from "../../../MediaGallery";
import { MediaType } from "../../../../enums/media";
import { CloseOutlined } from '@ant-design/icons'
import { Modal } from "antd";

type MessageTwoMediaProps = {
    medias: MessageMediaResource[]
}

const MessageTwoMedia: FC<MessageTwoMediaProps> = ({
    medias
}) => {
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [currentPreview, setCurrentPreview] = useState<number>(1);

    const handlePreview = (index: number) => {
        setCurrentPreview(index);
        setPreviewVisible(true);
    };

    return <>
        <div className="grid grid-cols-2 gap-2">
            {medias.map((item, index) => {
                return item.mediaType === MediaType.VIDEO ? (
                    <video
                        key={item.id}
                        src={item.mediaUrl}
                        className="w-16 h-16 rounded-lg object-cover aspect-square"
                        onClick={() => handlePreview(index)}
                        controls
                    />
                ) : (
                    <img
                        key={item.id}
                        src={item.mediaUrl}
                        alt={`Post Media ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover aspect-square"
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
            <MediaGallery medias={medias} currentPreview={currentPreview} />
        </Modal>
    </>
};

export default MessageTwoMedia;
