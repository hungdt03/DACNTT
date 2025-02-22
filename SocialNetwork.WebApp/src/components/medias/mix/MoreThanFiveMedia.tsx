import React, { FC, useState } from "react";
import { MixMediaProps } from "./MixMediaProps";
import MediaGallery from "../../MediaGallery";
import { CloseOutlined } from '@ant-design/icons'
import { Modal } from "antd";
import { MediaType } from "../../../enums/media";

const MoreThanFiveMedia: FC<MixMediaProps> = ({
    items
}) => {
    const maxVisibleMedia = 5;
    const visibleMedia = items.slice(0, maxVisibleMedia);
    const extraMedia = items.slice(maxVisibleMedia - 1);

    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [currentPreview, setCurrentPreview] = useState<number>(1);

    const handlePreview = (index: number) => {
        setCurrentPreview(index);
        setPreviewVisible(true);
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2">
                    {visibleMedia.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="cursor-pointer">
                            {item.mediaType === MediaType.VIDEO ? (
                                <video
                                    src={item.mediaUrl}
                                    className="w-full h-full object-cover"
                                    onClick={() => handlePreview(index)}
                                    controls
                                />
                            ) : (
                                <img
                                    src={item.mediaUrl}
                                    className="w-full h-full object-cover"
                                    onClick={() => handlePreview(index)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {visibleMedia.slice(3, 5).map((item, index) => (
                        <React.Fragment key={index}>
                            {index === 0 && (<div key={item.id} className="cursor-pointer">
                                {item.mediaType === MediaType.VIDEO ? (
                                    <video
                                        src={item.mediaUrl}
                                        className="w-full h-full object-cover"
                                        onClick={() => handlePreview(3)}
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={item.mediaUrl}
                                        alt={`Post Media ${index + 4}`}
                                        className="w-full h-full object-cover"
                                        onClick={() => handlePreview(3)}
                                    />
                                )}
                            </div>)}

                            {index === 1 && extraMedia.length > 0 && (
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => handlePreview(4)}
                                >
                                    <div className="absolute inset-0">
                                        {item.mediaType === MediaType.VIDEO ? (
                                            <video
                                                src={item.mediaUrl}
                                                className="w-full h-full object-cover"
                                                controls
                                                style={{
                                                    zIndex: 50 - index
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={item.mediaUrl}
                                                alt={`Post Media ${index + 5}`}
                                                className="w-full h-full object-cover"
                                                style={{
                                                    zIndex: 50 - index
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="z-[60] absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-lg font-bold">
                                        +{extraMedia.length}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
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
    );
};

export default MoreThanFiveMedia;
