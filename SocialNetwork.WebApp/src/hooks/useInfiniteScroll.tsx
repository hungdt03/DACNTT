import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
    fetchMore: () => void;
    hasMore: boolean;
    loading: boolean;
    rootMargin?: string; // Mặc định "100px"
    triggerId?: string; // Mặc định là "scroll-trigger"
}

export const useInfiniteScroll = ({
    fetchMore,
    hasMore,
    loading,
    rootMargin = "100px",
    triggerId = "scroll-trigger",
}: UseInfiniteScrollProps) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchMore();
                }
            },
            { root: containerRef.current, rootMargin }
        );

        observerRef.current = observer;

        const triggerElement = document.getElementById(triggerId);
        if (triggerElement) observer.observe(triggerElement);

        return () => {
            if (observerRef.current && triggerElement) {
                observer.unobserve(triggerElement);
            }
        };
    }, [hasMore, loading, rootMargin, triggerId]);

    return { containerRef };
};
