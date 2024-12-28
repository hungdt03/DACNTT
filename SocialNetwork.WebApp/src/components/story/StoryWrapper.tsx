import { FC, useEffect, useRef, useState } from "react";
import StoryItem from "./StoryItem";
import StoryCreator from "./StoryCreator";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "antd";
import useModal from "../../hooks/useModal";
import ViewStory from "./ViewStory";
import { UserStoryResource } from "../../types/userStory";
import storyService from "../../services/storyService";


const StoryWrapper: FC = () => {
    const [showPrev, setShowPrev] = useState(false);
    const { isModalOpen, showModal, handleCancel, handleOk } = useModal();
    const [selectStory, setSelectStory] = useState<UserStoryResource>();

    const [userStories, setUserStories] = useState<UserStoryResource[]>([])

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchUserStories = async () => {
            const response = await storyService.getAllStories();
            if (response.isSuccess) {
                setUserStories(response.data)
            }
        }

        fetchUserStories()
    }, [])

    return <>
        <div className="relative w-full h-[200px]">
            <Swiper
                modules={[Navigation]}
                slidesPerView={4.75}
                spaceBetween={8}
                onSlideChange={(swiper) => setShowPrev(swiper.isBeginning === false)}
                navigation={{
                    nextEl: nextRef.current,
                    prevEl: prevRef.current,
                }}
                onBeforeInit={(swiper) => {
                    if (typeof swiper.params.navigation !== 'boolean') {
                        swiper.params.navigation!.prevEl = prevRef.current;
                        swiper.params.navigation!.nextEl = nextRef.current;
                    }
                }}
            >
                <SwiperSlide>
                    <StoryCreator />
                </SwiperSlide>
                {userStories.map((story, index) => <SwiperSlide key={index}>
                    <StoryItem onClick={() => {
                        setCurrentIndex(index)
                        setSelectStory(story)
                        showModal()
                    }} story={story} />
                </SwiperSlide>)}

            </Swiper>

            <button
                ref={prevRef}
                className={`absolute w-10 h-10 flex text-white bg-sky-400 hover:bg-primary items-center justify-center shadow rounded-full left-2 top-1/2 -translate-y-1/2 z-10 ${showPrev ? 'block' : 'hidden'
                    }`}
            >
                <ChevronLeft />
            </button>
            <button
                ref={nextRef}
                className="absolute w-10 h-10 flex text-white bg-sky-400 hover:bg-primary items-center justify-center shadow rounded-full right-2 top-1/2 -translate-y-1/2 z-10"
            >
                <ChevronRight />
            </button>
        </div>

        <Modal
            width='1200px'
            centered
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            className="custom-modal"
            styles={{
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
                footer: {
                    display: 'none'
                }
            }}
        >
            {selectStory && <ViewStory story={selectStory} />}
        </Modal>
    </>
};

export default StoryWrapper;
