import { FC, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules";
import SwiperCore, { Swiper as SwiperType } from "swiper";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
SwiperCore.use([Navigation]);
import 'swiper/css';
import { PostMediaResource } from "../types/post";
import { MediaType } from "../enums/media";

interface MediaGalleryProps {
    medias: PostMediaResource[];
    currentPreview: number;
}

const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(ext => url.endsWith(ext));
};


const MediaGallery: FC<MediaGalleryProps> = ({
    medias,
    currentPreview
}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [showNav, setShowNav] = useState(false);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [currentSlide, setCurrentSlide] = useState<number>(1);

    useEffect(() => {
        const handleShowNav = () => {
            if (swiperRef.current) {
                const swiperInstance = swiperRef.current;
                const currentSlidesPerView =
                    typeof swiperInstance.params.slidesPerView === 'number'
                        ? swiperInstance.params.slidesPerView
                        : 1;

                setShowNav(medias.length > currentSlidesPerView);
            }
        };

        const swiperInstance = swiperRef.current;
        swiperInstance?.on('resize', handleShowNav);
        handleShowNav();

        return () => {
            swiperInstance?.off('resize', handleShowNav);
        };
    }, [medias]);

    useEffect(() => {
        if (swiperRef.current) {
            const swiperInstance = swiperRef.current;

            swiperInstance.slideTo(currentPreview);

            setIsAtStart(currentPreview === 0);
            setIsAtEnd(currentPreview === medias.length - 1);
        } else {
            setIsAtStart(currentPreview === 0);
            setIsAtEnd(currentPreview === medias.length - 1);
        }
    }, [currentPreview, medias.length]);

    const handlePrevClick = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleNextClick = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const handleSlideChange = () => {
        if (swiperRef.current) {
            setCurrentSlide(swiperRef.current.activeIndex + 1);  // Set the current slide (1-indexed)
        }
    };

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.on("slideChange", () => {
                const isStart = swiperRef.current?.isBeginning;
                const isEnd = swiperRef.current?.isEnd;
                setIsAtStart(isStart || false);
                setIsAtEnd(isEnd || false);
            });
        }

        return () => {
            if (swiperRef.current) {
                swiperRef.current.off("slideChange");
            }
        };
    }, []);

    return <div className="py-8 flex flex-col items-center justify-center">

        <div className="relative w-full">
            <Swiper
                slidesPerView={1}
                className="w-full"
                direction="horizontal"
                modules={[Navigation]}
                onSlideChange={handleSlideChange}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {medias.map((item, index) => {
                    return <SwiperSlide key={index}>
                        <div className="relative flex justify-center items-center w-full aspect-[16/9] overflow-hidden">
                            {item.mediaType === MediaType.VIDEO ? (
                                <video
                                    src={item.mediaUrl}
                                    className="w-full h-full object-contain"
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.0)'
                                    }}
                                    controls
                                    draggable
                                />
                            ) : (
                                <img
                                    src={item.mediaUrl}
                                    className="w-full h-full object-contain"
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.0)'
                                    }}
                                    draggable
                                />
                            )}
                        </div>
                    </SwiperSlide>
                })}

            </Swiper>

            {showNav && (
                <>
                    <button
                        className={`custom-prev z-10 w-10 h-10 text-white flex items-center justify-center fixed top-1/2 left-5 transform -translate-y-1/2 p-2 rounded-full ${isAtStart ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handlePrevClick}
                        disabled={isAtStart}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        <LeftOutlined />
                    </button>
                    <button
                        className={`custom-next z-10 w-10 h-10 text-white flex items-center justify-center fixed top-1/2 right-5 transform -translate-y-1/2 p-2 rounded-full ${isAtEnd ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleNextClick}
                        disabled={isAtEnd}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        <RightOutlined />
                    </button>


                </>
            )}
        </div>

        <div className="flex items-center justify-center mt-2">
            <span className="text-gray-300 bg-black bg-opacity-30 py-2 px-3 font-bold rounded-lg">{currentSlide} / {medias.length}</span>
        </div>


    </div>
};

export default MediaGallery;
