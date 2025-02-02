import { useEffect, RefObject } from "react";

function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T>,
    callback: () => void,
    excludeRef?: RefObject<HTMLElement>
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                (!excludeRef || !excludeRef.current?.contains(event.target as Node))
            ) {
                callback();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback, excludeRef]);
}

export default useClickOutside;
