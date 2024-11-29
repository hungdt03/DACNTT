import { Image } from "antd";
import { FC, useState } from "react";
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
                            key={index}
                            src={image}
                            alt={`Post Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            preview={{
                                mask: null,
                            }}
                            onClick={() => {
                                setCurrentIndex(index)
                            }}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {visibleImages.slice(3, 5).map((image, index) => (
                        <>
                            {index === 0 && <div key={index}>
                                <Image
                                    src={image}
                                    alt={`Post Image ${index + 4}`}
                                    className="w-full h-full object-cover"
                                    preview={{
                                        mask: null,
                                    }}
                                    onClick={() => {
                                        console.log(index)
                                        setCurrentIndex(3)
                                    }}
                                />
                            </div>}
                            {index === 1 && extraImages.length > 0 && <div className="relative mb-2">
                                {extraImages.map((extra, index) => (
                                    <div key={index} className="absolute inset-0">
                                        <Image
                                            src={extra}
                                            key={index}
                                            alt={`Post Image ${index + 4}`}
                                            className="w-full h-full object-cover"
                                            style={{
                                                zIndex: 50 - index
                                            }}
                                            preview={{
                                                mask: null,
                                            }}
                                        />
                                    </div>
                                ))}

                                <button 
                                    onClick={handleImageClick}
                                    style={{
                                        zIndex: 100
                                    }}
                                    className="absolute inset-0 overflow-hidden w-full h-full bg-black bg-opacity-50 flex justify-center items-center text-white text-lg font-bold cursor-pointer"
                                >
                                    +{extraImages.length}
                                </button>
                            </div>}

                        </>
                    ))}
                </div>
            </div>
        </Image.PreviewGroup>
    );
};

export default MoreThanFiveImage;
