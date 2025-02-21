import { Image } from "antd";
import React, { FC, useState } from "react";
import { ImageProps } from "./ImageProps";


const MoreThanFiveImage: FC<ImageProps> = ({ items }) => {
    const maxVisibleImages = 5;
    const visibleImages = items.slice(0, maxVisibleImages);
    const extraImages = items.slice(maxVisibleImages - 1);

    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleImageClick = () => {
        setPreviewVisible(true);
        setCurrentIndex(4)
    };

    return (
        <Image.PreviewGroup preview={{
            visible: previewVisible,
            onVisibleChange: setPreviewVisible,
            current: currentIndex,
            onChange: setCurrentIndex
        }}>
            <div className="flex flex-col gap-y-2">
                <div className="grid grid-cols-3 gap-2">
                    {visibleImages.slice(0, 3).map((image, index) => (
                        <Image
                            key={image.id}
                            src={image.mediaUrl}
                            alt={`Post Image ${index + 1}`}
                            className="object-cover aspect-square"
                            width='100%'
                            height='100%'
                            style={{
                                minHeight: '200px'
                            }}
                            preview={{
                                mask: 'Xem',
                            }}
                            onClick={() => {
                                setCurrentIndex(index)
                            }}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {visibleImages.slice(3, 5).map((image, index) => (
                        <React.Fragment key={image.id}>
                            {index === 0 && <div >
                                <Image
                                    src={image.mediaUrl}
                                    alt={`Post Image ${index + 4}`}
                                    className="object-cover aspect-square"
                                    width='100%'
                                    height='100%'
                                    preview={{
                                        mask: 'Xem',
                                    }}
                                    style={{
                                        minHeight: '200px'
                                    }}
                                    onClick={() => {
                                        setCurrentIndex(3)
                                    }}
                                />
                            </div>}
                            {index === 1 && extraImages.length > 0 && <div className="relative overflow-hidden">
                                {extraImages.map((extra, index) => (
                                    <div key={extra.id} className="absolute inset-0">
                                        <Image
                                            src={extra.mediaUrl}
                                            alt={`Post Image ${index + 4}`}
                                            className="object-cover"
                                            width='100%'
                                            height='100%'
                                            style={{
                                                zIndex: 50 - index + 1,
                                                minHeight: '200px'
                                            }}
                                            preview={{
                                                mask: 'Xem',
                                            }}
                                        />
                                    </div>
                                ))}

                                <button 
                                    onClick={handleImageClick}
                                    className="z-[100] absolute inset-0 overflow-hidden w-full h-full bg-black bg-opacity-50 flex justify-center items-center text-white text-lg font-bold cursor-pointer"
                                >
                                    +{extraImages.length}
                                </button>
                            </div>}

                        </React.Fragment>
                    ))}
                </div>
            </div>
        </Image.PreviewGroup>
    );
};

export default MoreThanFiveImage;
