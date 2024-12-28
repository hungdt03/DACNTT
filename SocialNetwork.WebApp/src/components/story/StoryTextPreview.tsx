import { FC, useEffect, useRef, useState } from "react";

type StoryTextPreviewProps = {
    content: string;
    background: string;
    fontFamily: string;
}

type TextStoryExpand = 'expand' | 'collapse' | 'unknown';

const StoryTextPreview: FC<StoryTextPreviewProps> = ({
    content,
    background,
    fontFamily = "'Noto Sans', sans-serif"
}) => {
    const [isExpanded, setIsExpanded] = useState<TextStoryExpand>('unknown');

    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (contentRef.current) {
            const element = contentRef.current;
            const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
            const maxHeight = lineHeight * 7;
            if (element.scrollHeight > maxHeight) {
                setIsOverflowing(true);
                setIsExpanded('collapse');
            } else {
                setIsOverflowing(false);
                setIsExpanded('unknown');
            }
        }
    }, [content]);

    return <div className="w-[85%] h-[90%] flex flex-col gap-y-3 shadow-2xl border-[1px] border-gray-100 bg-white rounded-xl p-4">
        <span className="font-semibold">Xem trước</span>

        <div className="bg-gray-950 rounded-xl w-full h-full flex items-center justify-center">
            <div style={{
                aspectRatio: 9 / 16,
                background: background
            }} className="rounded-xl h-[95%] w-[33.333333%] flex flex-col items-start justify-center px-6 overflow-hidden py-10">
                <div
                    ref={contentRef}
                    className={`text-white text-center break-words break-all font-semibold text-xl overflow-hidden ${isExpanded === 'expand' ? "overflow-y-scroll" : "line-clamp-7"
                        }`}
                    style={{
                        display: isExpanded === 'expand' ? "block" : "-webkit-box",
                        WebkitLineClamp: isExpanded === 'expand' ? "none" : 7,
                        WebkitBoxOrient: "vertical",
                        fontFamily: fontFamily
                    }}
                >
                    {content}
                </div>
                <div className="flex items-center justify-start">
                    {isOverflowing && isExpanded === 'collapse' && (
                        <button
                            onClick={() => setIsExpanded('expand')}
                            className="mt-2 text-sm text-white font-bold hover:underline"
                        >
                            XEM THÊM
                        </button>
                    )}
                    {isExpanded === 'expand' && (
                        <button
                            onClick={() => setIsExpanded('collapse')}
                            className="mt-2 text-sm text-white font-bold hover:underline"
                        >
                            ẨN BỚT
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
};

export default StoryTextPreview;
