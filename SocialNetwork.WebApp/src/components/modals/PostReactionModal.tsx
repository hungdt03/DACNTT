import { Avatar, Tabs } from "antd";
import { FC, useEffect, useState } from "react";
import { ReactionSvgType, svgReaction } from "../../assets/svg";
import images from "../../assets";
import { ReactionResource } from "../../types/reaction";


// const items: TabsProps['items'] = [
//     {
//         key: '1',
//         label: 'Tất cả',
//     },
//     {
//         key: '2',
//         label: <div className="flex items-center gap-x-2">
//             <img src={svgReaction.like} className="w-5 h-5 cursor-pointer" />
//             <span>12</span>
//         </div>,
//     },
//     {
//         key: '3',
//         label: <div className="flex items-center gap-x-2">
//             <img src={svgReaction.love} className="w-5 h-5 cursor-pointer" />
//             <span>12</span>
//         </div>,
//     },
//     {
//         key: '4',
//         label: <div className="flex items-center gap-x-2">
//             <img src={svgReaction.care} className="w-5 h-5 cursor-pointer" />
//             <span>12</span>
//         </div>,
//     },
//     {
//         key: '5',
//         label: <div className="flex items-center gap-x-2">
//             <img src={svgReaction.haha} className="w-5 h-5 cursor-pointer" />
//             <span>12</span>
//         </div>,
//     },
//     {
//         key: '6',
//         label: <div className="flex items-center gap-x-2">
//             <img src={svgReaction.sad} className="w-5 h-5 cursor-pointer" />
//             <span>12</span>
//         </div>,
//     },
//     {
//         key: '7',
//         label: <div className="flex items-center gap-x-2">
//             <img src={svgReaction.angry} className="w-5 h-5 cursor-pointer" />
//             <span>12</span>
//         </div>,
//     },

// ];

const groupByReactionType = (reactions?: ReactionResource[]) => {
    return reactions?.reduce((acc, reaction) => {
        const { reactionType } = reaction;
        if (!acc[reactionType]) {
            acc[reactionType] = [];
        }
        acc[reactionType].push(reaction);
        return acc;
    }, {} as Record<string, ReactionResource[]>);
};

type PostReactionModalProps = {
    reactions?: ReactionResource[]
}

const PostReactionModal: FC<PostReactionModalProps> = ({
    reactions
}) => {
    const [groupReaction, setGroupReaction] = useState<Record<string, ReactionResource[]> | undefined>(
        groupByReactionType(reactions)
    );

    const onChange = (key: string) => {
        console.log('Selected Tab:', key);
    };

    useEffect(() => {
        setGroupReaction(groupByReactionType(reactions));
    }, [reactions]);

    const items = [
        {
            key: '1',
            label: 'Tất cả',
            children: (
                <div>
                    {reactions?.map((reaction) => (
                        <div key={reaction.id} className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                            <div className="relative">
                                <Avatar size='large' src={reaction.user.avatar} />
                                <img
                                    src={svgReaction[reaction.reactionType] || svgReaction.LIKE}
                                    className="w-4 h-4 cursor-pointer absolute bottom-0 right-0"
                                    alt={reaction.reactionType}
                                />
                            </div>
                            <span>{reaction.user.fullName}</span>
                        </div>
                    ))}
                </div>
            ),
        },
        ...(groupReaction
            ? Object.entries(groupReaction).map(([reactionType, reactions], index) => ({
                key: (index + 2).toString(),
                label: (
                    <div className="flex items-center gap-x-2">
                        <img
                            src={svgReaction[reactionType as ReactionSvgType] || svgReaction.LIKE}
                            className="w-5 h-5 cursor-pointer"
                            alt={reactionType}
                        />
                        <span>{reactions.length}</span>
                    </div>
                ),
                children: (
                    <div>
                        {reactions.map((reaction) => (
                            <div key={reaction.id} className="flex items-center gap-x-3 px-2 py-[6px] rounded-xl hover:bg-gray-100">
                                <div className="relative">
                                    <Avatar size='large' src={reaction.user.avatar} />
                                    <img
                                        src={svgReaction[reactionType as ReactionSvgType] || svgReaction.LIKE}
                                        className="w-4 h-4 cursor-pointer absolute bottom-0 right-0"
                                        alt={reactionType}
                                    />
                                </div>
                                <span>{reaction.user.fullName}</span>
                            </div>
                        ))}
                    </div>
                ),
            }))
            : []),
    ];

    return <Tabs defaultActiveKey="1" onChange={onChange} items={items} />

};

export default PostReactionModal;
