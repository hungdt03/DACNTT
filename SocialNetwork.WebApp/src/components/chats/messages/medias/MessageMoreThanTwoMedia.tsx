import { FC, useState } from "react";
import { MessageMediaResource } from "../../../../types/message";
import { CloseOutlined } from '@ant-design/icons'
import { MediaType } from "../../../../enums/media";
import MediaGallery from "../../../MediaGallery";
import { Modal } from "antd";

type MessageMoreThanTwoMediaProps = {
    medias: MessageMediaResource[]
}
const MessageMoreThanTwoMedia: FC<MessageMoreThanTwoMediaProps> = ({
    medias
}) => {
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [currentPreview, setCurrentPreview] = useState<number>(1);

    const handlePreview = (index: number) => {
        setCurrentPreview(index);
        setPreviewVisible(true);
    };


    return <>
        <div className="grid grid-cols-3 gap-1 my-2">
            {medias.map((item, index) => {
                return item.mediaType === MediaType.VIDEO ? (
                    <video
                        src={item.mediaUrl}
                        key={item.id}
                        className="w-[54px] h-[54px] object-cover rounded-lg"
                        onClick={() => handlePreview(index)}
                        // controls
                    />
                ) : (
                    <img
                        key={item.id}
                        src={item.mediaUrl}
                        alt={`Post Media ${index}`}
                        className="w-[54px] h-[54px] object-cover rounded-lg"
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

export default MessageMoreThanTwoMedia;
