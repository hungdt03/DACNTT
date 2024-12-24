import { FC, useRef, useState } from "react";
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
import { Story } from "react-insta-stories/dist/interfaces";


const StoryWrapper: FC = () => {
    const [showPrev, setShowPrev] = useState(false);
    const { isModalOpen, showModal, handleCancel, handleOk } = useModal();
    const [selectStory, setSelectStory] = useState<Story[]>()
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    // Các ảnh cho từng story
    const stories = [
        [
            { url: "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/415026176_367351105878728_9160707036274657793_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGbTEdtGKlVJQfRxu_rzcKHnZQwh6N-P12dlDCHo34_Xe8cD09ZBVMoxXYcWoqKajke466jeewyz7TsDyPhYg5F&_nc_ohc=25CwFZ7wAcsQ7kNvgEwFaj7&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=AhT04rPWBL_-gDQIneme_M6&oh=00_AYCerj2GngIpFR4GbFiGH80ooOvgc7LBRWT3KoIUWCIdGg&oe=677099E2" },
            { url: "https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/414978381_367290745884764_8896249503976342057_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFr8l1Rg2XvS_V40sq3AKoitj57LgR4yMK2PnsuBHjIwokdwmrvV-X-89koZlPXccBKzMQABEeMhmiAbJFWH9IA&_nc_ohc=xQFb_oHdK2kQ7kNvgEeRaQ4&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=ArpvMfpNMZWVrKhaIBRgx_E&oh=00_AYD_KHo95RxiKSLA57t95dC6vB7TSIQK9nz5v1rG78Wj4w&oe=677098C5" },
            { url: "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/321445616_712032870339040_8857342046131269174_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFMI9DvM6FdnFDlvWDHfvXbo4U-Bh3aOY6jhT4GHdo5jqWZPaZo-4xZdCLIA7ElBr1iafadH3Tr59R6DOYWs9OA&_nc_ohc=ftlVUuVSAzEQ7kNvgGgboDL&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=A_0Tvk_swOCzAo69KFYfLr0&oh=00_AYC_GzmJFJ2s2ZlTaeeOBZHUN-TdAowq-8DxJatZa7Mw8w&oe=67709130" },
        ],
        [
            { url: "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/415026176_367351105878728_9160707036274657793_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGbTEdtGKlVJQfRxu_rzcKHnZQwh6N-P12dlDCHo34_Xe8cD09ZBVMoxXYcWoqKajke466jeewyz7TsDyPhYg5F&_nc_ohc=25CwFZ7wAcsQ7kNvgEwFaj7&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=AhT04rPWBL_-gDQIneme_M6&oh=00_AYCerj2GngIpFR4GbFiGH80ooOvgc7LBRWT3KoIUWCIdGg&oe=677099E2" },
            { url: "https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/414978381_367290745884764_8896249503976342057_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFr8l1Rg2XvS_V40sq3AKoitj57LgR4yMK2PnsuBHjIwokdwmrvV-X-89koZlPXccBKzMQABEeMhmiAbJFWH9IA&_nc_ohc=xQFb_oHdK2kQ7kNvgEeRaQ4&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=ArpvMfpNMZWVrKhaIBRgx_E&oh=00_AYD_KHo95RxiKSLA57t95dC6vB7TSIQK9nz5v1rG78Wj4w&oe=677098C5" },
            { url: "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/321445616_712032870339040_8857342046131269174_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFMI9DvM6FdnFDlvWDHfvXbo4U-Bh3aOY6jhT4GHdo5jqWZPaZo-4xZdCLIA7ElBr1iafadH3Tr59R6DOYWs9OA&_nc_ohc=ftlVUuVSAzEQ7kNvgGgboDL&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=A_0Tvk_swOCzAo69KFYfLr0&oh=00_AYC_GzmJFJ2s2ZlTaeeOBZHUN-TdAowq-8DxJatZa7Mw8w&oe=67709130" },
        ],
        [
            { url: "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/415026176_367351105878728_9160707036274657793_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGbTEdtGKlVJQfRxu_rzcKHnZQwh6N-P12dlDCHo34_Xe8cD09ZBVMoxXYcWoqKajke466jeewyz7TsDyPhYg5F&_nc_ohc=25CwFZ7wAcsQ7kNvgEwFaj7&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=AhT04rPWBL_-gDQIneme_M6&oh=00_AYCerj2GngIpFR4GbFiGH80ooOvgc7LBRWT3KoIUWCIdGg&oe=677099E2" },
            { url: "https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/414978381_367290745884764_8896249503976342057_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFr8l1Rg2XvS_V40sq3AKoitj57LgR4yMK2PnsuBHjIwokdwmrvV-X-89koZlPXccBKzMQABEeMhmiAbJFWH9IA&_nc_ohc=xQFb_oHdK2kQ7kNvgEeRaQ4&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=ArpvMfpNMZWVrKhaIBRgx_E&oh=00_AYD_KHo95RxiKSLA57t95dC6vB7TSIQK9nz5v1rG78Wj4w&oe=677098C5" },
            { url: "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/321445616_712032870339040_8857342046131269174_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFMI9DvM6FdnFDlvWDHfvXbo4U-Bh3aOY6jhT4GHdo5jqWZPaZo-4xZdCLIA7ElBr1iafadH3Tr59R6DOYWs9OA&_nc_ohc=ftlVUuVSAzEQ7kNvgGgboDL&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=A_0Tvk_swOCzAo69KFYfLr0&oh=00_AYC_GzmJFJ2s2ZlTaeeOBZHUN-TdAowq-8DxJatZa7Mw8w&oe=67709130" },
        ],
        [
            { url: "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/415026176_367351105878728_9160707036274657793_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGbTEdtGKlVJQfRxu_rzcKHnZQwh6N-P12dlDCHo34_Xe8cD09ZBVMoxXYcWoqKajke466jeewyz7TsDyPhYg5F&_nc_ohc=25CwFZ7wAcsQ7kNvgEwFaj7&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=AhT04rPWBL_-gDQIneme_M6&oh=00_AYCerj2GngIpFR4GbFiGH80ooOvgc7LBRWT3KoIUWCIdGg&oe=677099E2" },
            { url: "https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/414978381_367290745884764_8896249503976342057_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFr8l1Rg2XvS_V40sq3AKoitj57LgR4yMK2PnsuBHjIwokdwmrvV-X-89koZlPXccBKzMQABEeMhmiAbJFWH9IA&_nc_ohc=xQFb_oHdK2kQ7kNvgEeRaQ4&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=ArpvMfpNMZWVrKhaIBRgx_E&oh=00_AYD_KHo95RxiKSLA57t95dC6vB7TSIQK9nz5v1rG78Wj4w&oe=677098C5" },
            { url: "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/321445616_712032870339040_8857342046131269174_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFMI9DvM6FdnFDlvWDHfvXbo4U-Bh3aOY6jhT4GHdo5jqWZPaZo-4xZdCLIA7ElBr1iafadH3Tr59R6DOYWs9OA&_nc_ohc=ftlVUuVSAzEQ7kNvgGgboDL&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=A_0Tvk_swOCzAo69KFYfLr0&oh=00_AYC_GzmJFJ2s2ZlTaeeOBZHUN-TdAowq-8DxJatZa7Mw8w&oe=67709130" },
        ],
    ];


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
                {stories.map((story, index) => <SwiperSlide key={index}>
                    <StoryItem onClick={() => {
                        setCurrentIndex(index)
                        setSelectStory(story)
                        showModal()
                    }} items={story} />
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
            {selectStory && <ViewStory onEnd={() => {
                
            }} story={selectStory} />}
        </Modal>
    </>
};

export default StoryWrapper;
