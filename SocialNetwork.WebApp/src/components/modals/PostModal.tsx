import { HeartIcon, MoreHorizontal, ShareIcon } from "lucide-react";
import { FC, useState } from "react";
import images from "../../assets";
import { Avatar, Divider, Modal, Popover, Tooltip } from "antd";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { PostMoreAction, PostReaction } from "../posts/Post";
import { svgReaction } from "../../assets/svg";
import useModal from "../../hooks/useModal";
import PostReactionModal from "./PostReactionModal";
import { Comment } from "../../types/comment";
import { comments } from "../../fake-data/data-comment";
import cn from "../../utils/cn";
import BoxReplyComment from "../BoxReplyComment";

export const CommentItem: React.FC<{ comment: Comment; onReply: (id: number) => void; replyToId: number | null; level: number }> = ({
    comment,
    onReply,
    replyToId,
    level
}) => {
    const isReplying = replyToId === comment.id;

    return (
        <div className={cn("flex flex-col pl-4", comment.commentParentId !== null ? "gap-y-5" : "gap-y-3")}>
            {/* Comment nội dung */}
            <div className="relative flex items-start gap-x-2">
                {comment.commentParentId && (
                    <div className="absolute -left-[24px] w-7 top-[0px] h-[20px] bg-transparent border-b-[2px] rounded-lg border-gray-200"></div>
                )}
                <Avatar className="flex-shrink-0" src={images.user} />
                <div className="flex flex-col gap-y-1">
                    <div className="py-2 px-4 rounded-2xl bg-gray-100 flex flex-col items-start">
                        <span className="font-semibold">{comment.user}</span>
                        <p className="text-left">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-x-4 px-2">
                        <span className="text-xs">{comment.createdAt}</span>
                        <button
                            className="text-xs hover:underline"
                            onClick={() => onReply(comment.id)}
                        >
                            Phản hồi
                        </button>
                    </div>
                </div>
            </div>

            {/* Render comment con */}
            {comment.children && comment.children.length > 0 && (
                <div className="relative flex flex-col gap-y-3 pl-6">
                    <div className="absolute -top-[60px] left-[16px] bottom-16 w-[2px] bg-gray-200"></div>
                    {comment.children.map((child) => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            onReply={onReply}
                            replyToId={replyToId}
                            level={level + 1}
                        />
                    ))}

                    {/* Box phản hồi ở cuối nếu đang reply comment này */}
                    {isReplying && (
                        <>
                            <div className="absolute left-4 w-[28px] -top-[24px] h-full bg-transparent border-l-[2px] border-b-[2px] rounded-bl-lg border-gray-200"></div>
                            <div className={cn(level === 3 ? "pl-0" : "pl-4")}>
                                <BoxReplyComment />
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Nếu không có comment con, hiển thị box reply trực tiếp dưới comment */}
            {isReplying && !comment.children?.length && (
                <div className="relative">
                    {level < 3 && <>
                        <div className="absolute left-4 w-[66px] -top-[60px] h-full bg-transparent border-l-[2px] border-gray-200"></div>
                        {/* <div className="absolute left-4 w-[24px] -top-[28px] h-full bg-transparent border-l-[2px] border-b-[2px] rounded-bl-lg border-gray-200"></div> */}
                        {/* <div className="absolute -left-[24px] w-7 top-[0px] h-[20px] bg-transparent border-b-[2px] rounded-lg border-gray-200"></div> */}
                        <div className="absolute left-4 w-[24px] -top-[28px] h-full bg-transparent border-l-[2px] border-b-[2px] rounded-bl-lg border-gray-200"></div>
                    </>}
                    <div className={cn(level === 3 ? "pl-0" : "pl-10")}>
                        <BoxReplyComment />
                    </div>
                </div>
            )}
        </div>
    );
};

export const CommentList: React.FC<{ comments: Comment[] }> = ({ comments }) => {
    const [replyToId, setReplyToId] = useState<number | null>(null);

    const handleReply = (id: number) => {
        // Nếu người dùng bấm lại comment hiện tại, ẩn box phản hồi
        setReplyToId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="flex flex-col gap-y-3">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    replyToId={replyToId}
                    level={1}
                />
            ))}
        </div>
    );
};


const PostModal: FC = () => {
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal()

    return <div className="flex flex-col gap-y-2 p-4 bg-white rounded-md h-[450px] overflow-y-auto custom-scrollbar">
        <Divider className="my-0" />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <Avatar className="w-10 h-10" src={images.user} />
                <div className="flex flex-col gap-y-[1px]">
                    <span className="font-semibold text-[16px] text-gray-600">Bùi Văn Yên</span>
                    <div className="flex items-center gap-x-2">
                        <Tooltip title='Thứ bảy, 23 tháng 11, 2014 lúc 19:17'>
                            <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">35 phút trước</span>
                        </Tooltip>
                        <Tooltip title='Công khai'>
                            <button className="mb-[2px]">
                                <img className="w-3 h-3" src={images.earth} alt="Public" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <Popover content={<PostMoreAction />}>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <MoreHorizontal className="text-gray-400" />
                </button>
            </Popover>
        </div>

        <div className="flex flex-col gap-y-3">
            <p className="text-sm text-gray-700">Các cao nhân IT chỉ cách cứu dùm em, ổ C của lap em đang bị đỏ mặc dù đã xóa bớt đi mấy file không dùng. Giờ em phải làm sao cho nó về bth lại đây ạ :(((. Cao nhân chỉ điểm giúp em với</p>

            <div>
                <img src={images.cover} />
            </div>
        </div>
        <div className="flex items-center justify-between text-sm">
            <button onClick={showModal} className="flex gap-x-[2px] items-center">
                <Avatar.Group>
                    <img src={svgReaction.like} className="w-5 h-5 mx-[5px]" />
                    <img src={svgReaction.love} className="w-5 h-5 mx-[5px]" />
                    <img src={svgReaction.care} className="w-5 h-5 mx-[5px]" />
                </Avatar.Group>
                <span className="hover:underline">112</span>
            </button>
            <div className="flex gap-x-4 items-center">
                <button className="hover:underline text-gray-500">17 bình luận</button>
                <button className="hover:underline text-gray-500">17 lượt chia sẻ</button>
            </div>
        </div>
        <Divider className='my-0' />
        <div className="flex items-center justify-between gap-x-4">
            <Popover content={<PostReaction />}>
                <button className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                    <HeartIcon className="h-5 w-5 text-gray-500" />
                    <span>Thích</span>
                </button>
            </Popover>
            <button className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-500" />
                <span>Bình luận</span>
            </button>
            <button className="py-2 cursor-pointer rounded-md hover:bg-gray-100 w-full flex justify-center gap-x-2 text-sm text-gray-500">
                <ShareIcon className="h-5 w-5 text-gray-500" />
                <span>Chia sẻ</span>
            </button>
        </div>
        <Divider className='mt-0 mb-2' />

        <CommentList comments={comments} />

        <Modal style={{ top: 20 }} title={<p className="text-center font-semibold text-xl">Cảm xúc bài viết</p>} width='600px' footer={[]} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <PostReactionModal />
        </Modal>
    </div>
};

export default PostModal;

