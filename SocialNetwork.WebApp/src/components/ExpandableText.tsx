import { FC, useState } from "react";

type ExpandableTextProps = {
    content: string
}

const ExpandableText: FC<ExpandableTextProps> = ({
    content
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative">
            <p
                className={`text-xs md:text-sm text-gray-700 break-words whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-5" }`}
            >
                {content}
            </p>

            {/* Nút Hiện thêm / Ẩn bớt */}
            {content.split("\n").length > 5 && (
                <button
                    className="text-black text-sm mt-2 font-bold hover:underline"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? "Ẩn bớt" : "Hiện thêm"}
                </button>
            )}
        </div>
    );
};

export default ExpandableText;
