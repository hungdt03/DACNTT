import { Modal } from "antd";
import React, { useState } from "react";
import MediaGallery from "../MediaGallery";
import { CloseOutlined } from '@ant-design/icons'

interface PostVideoProps {
    videos: string[];
}

const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(ext => url.endsWith(ext));
};

const PostVideo: React.FC<PostVideoProps> = ({ videos }) => {
    const maxVisibleMedia = 5;
    const visibleMedia = videos.slice(0, maxVisibleMedia);
    const extraMedia = videos.slice(maxVisibleMedia - 1);

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
                        <div key={index} className="cursor-pointer">
                            {isVideo(item) ? (
                                <video
                                    src={item}
                                    className="w-full min-h-[200px] object-cover"
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
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {visibleMedia.slice(3, 5).map((item, index) => (
                        <React.Fragment key={index}>
                            {index === 0 && (<div key={index} className="cursor-pointer">
                                {isVideo(item) ? (
                                    <video
                                        src={item}
                                        className="w-full min-h-[200px] object-cover"
                                        onClick={() => handlePreview(3)}
                                    />
                                ) : (
                                    <img
                                        src={item}
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
                                        {isVideo(item) ? (
                                            <video
                                                src={item}
                                                className="w-full min-h-[200px] object-cover"
                                                style={{
                                                    zIndex: 50 - index
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={item}
                                                alt={`Post Media ${index + 5}`}
                                                className="w-full h-full object-cover"
                                                style={{
                                                    zIndex: 50 - index
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div style={{
                                        zIndex: 100
                                    }} className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-lg font-bold">
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
                <MediaGallery medias={videos} currentPreview={currentPreview} />
            </Modal>
        </>
    );

};

export default PostVideo;