import { useEffect } from "react";

interface UseElementInfinityScrollProps {
    elementId: string; // ID của phần tử cần theo dõi
    onLoadMore: () => void;
    isLoading: boolean;
    hasMore: boolean;
    offset?: number; // Khoảng cách trước khi chạm đáy để load thêm dữ liệu
}

export const useElementInfinityScroll = ({
    elementId,
    onLoadMore,
    isLoading,
    hasMore,
    offset = 150,
}: UseElementInfinityScrollProps) => {
    useEffect(() => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const handleScroll = () => {
            if (isLoading || !hasMore) return;

            const { scrollTop, scrollHeight, clientHeight } = element;
            if (scrollTop + clientHeight >= scrollHeight - offset) {
                onLoadMore();
            }
        };

        element.addEventListener("scroll", handleScroll);
        return () => element.removeEventListener("scroll", handleScroll);
    }, [elementId, onLoadMore, isLoading, hasMore, offset]);
};
