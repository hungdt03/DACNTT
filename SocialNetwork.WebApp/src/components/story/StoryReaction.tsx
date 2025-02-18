import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactionType } from "../../enums/reaction";
import { svgReaction } from "../../assets/svg";

type StoryReactionProps = {
    onSelect?: (reaction: ReactionType) => void;
};

const StoryReaction: FC<StoryReactionProps> = ({ onSelect }) => {
    const [flyingReaction, setFlyingReaction] = useState<{ id: number; type: ReactionType }[]>([]);

    const handleSelect = (reaction: ReactionType) => {
        onSelect?.(reaction);
        const id = Date.now(); // Unique ID for each reaction animation
        setFlyingReaction((prev) => [...prev, { id, type: reaction }]);
        setTimeout(() => {
            setFlyingReaction((prev) => prev.filter((item) => item.id !== id));
        }, 1200);
    };

    return (
        <div className="relative flex items-center gap-x-2">
            {Object.values(ReactionType).map((reaction) => (
                <button key={reaction} onClick={() => handleSelect(reaction)}>
                    <img
                        alt={reaction.toLowerCase()}
                        src={svgReaction[reaction]}
                        className="w-8 h-8 hover:scale-105 hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer"
                    />
                </button>
            ))}

            {/* Hiệu ứng bay lên */}
            <AnimatePresence>
                {flyingReaction.map(({ id, type }) => (
                    <motion.img
                        key={id}
                        src={svgReaction[type]}
                        alt={type.toLowerCase()}
                        initial={{ opacity: 0, y: 0, scale: 1 }}
                        animate={{ opacity: 1, y: -250, scale: 1 }}
                        exit={{ opacity: 0, y: -350 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10"
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default StoryReaction;
