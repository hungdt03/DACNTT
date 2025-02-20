import { FC, useEffect, useRef, useState } from "react";
import StoryItem from "./StoryItem";
import StoryCreator from "./StoryCreator";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserStoryResource } from "../../types/userStory";
import storyService from "../../services/storyService";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import StorySkeleton from "../skeletons/StorySkeleton";
import CreateStoryArea from "./CreateStoryArea";


const StoryWrapper: FC = () => {
    const { user } = useSelector(selectAuth)
    const [loading, setLoading] = useState(false)
    const [showPrev, setShowPrev] = useState(false);
    const [userStories, setUserStories] = useState<UserStoryResource[]>([])

    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchUserStories = async () => {
            setLoading(true)
            const response = await storyService.getAllStories();
            setLoading(false)
            if (response.isSuccess) {
                setUserStories(response.data)
            }
        }

        fetchUserStories()
    }, [])

    return (
        <div className={`relative w-full ${userStories.length > 0 ? "h-[160px] md:h-[200px]" : "h-auto"}`}>
            {/* Hiển thị skeleton khi loading */}
            {loading && (
                <div className="flex items-center gap-x-3 pb-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <StorySkeleton key={index} />
                    ))}
                </div>
            )}

            {/* Hiển thị Swiper khi có story */}
            {!loading && userStories.length > 0 && (
                <Swiper
                    modules={[Navigation]}
                    slidesPerView={4.75}
                    spaceBetween={8}
                    breakpoints={{
                        1024: { slidesPerView: 4.75, spaceBetween: 8 },
                        768: { slidesPerView: 5, spaceBetween: 8 },
                        540: { slidesPerView: 5.5, spaceBetween: 8 },
                        380: { slidesPerView: 4.25, spaceBetween: 8 },
                        300: { slidesPerView: 3.5, spaceBetween: 8 },
                    }}
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
                    {/* Story Creator */}
                    <SwiperSlide>
                        <StoryCreator />
                    </SwiperSlide>

                    {/* Hiển thị stories của chính user */}
                    {userStories.filter((s) => s.user.id === user?.id).map((story, index) => (
                        <SwiperSlide key={`user-${index}`}>
                            <StoryItem story={story} />
                        </SwiperSlide>
                    ))}

                    {/* Hiển thị stories của người khác */}
                    {userStories.filter((s) => s.user.id !== user?.id).map((story, index) => (
                        <SwiperSlide key={`other-${index}`}>
                            <StoryItem story={story} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) }
            
            {!loading && userStories.length === 0 && (
                // Không có story nào -> Hiển thị CreateStoryArea
                <CreateStoryArea />
            )}

            {/* Nút điều hướng chỉ hiển thị khi có stories */}
            {userStories.length > 0 && (
                <>
                    <button
                        ref={prevRef}
                        className={`absolute w-10 h-10 flex bg-sky-50 text-primary hover:bg-sky-100 items-center justify-center shadow rounded-full left-2 top-1/2 -translate-y-1/2 z-10 ${showPrev ? "block" : "hidden"}`}
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        ref={nextRef}
                        className="absolute w-10 h-10 flex bg-sky-50 text-primary hover:bg-sky-100 items-center justify-center shadow rounded-full right-2 top-1/2 -translate-y-1/2 z-10"
                    >
                        <ChevronRight />
                    </button>
                </>
            )}
        </div>
    );

}

export default StoryWrapper;
