export type Comment = {
    id: number;
    content: string;
    user: string;
    createdAt: string;
    commentParentId: number | null; // null nếu là bình luận cấp 1
    children?: Comment[];
  };
  