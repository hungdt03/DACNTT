
export type ContentTypeKey = 'MEDIA' | 'TEXT' | 'BACKGROUND' | 'SHARE' | 'ALL';
export type SortOrderKey = 'asc' | 'desc';

export interface ContentType {
    key: ContentTypeKey;
    label: string;
}

interface SortOrder {
    key: SortOrderKey;
    label: string;
}

export const CONTENT_TYPES: ContentType[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'MEDIA', label: 'Ảnh/video' },
    { key: 'TEXT', label: 'Văn bản' },
    { key: 'BACKGROUND', label: 'Phông nền' },
    { key: 'SHARE', label: 'Chia sẻ lại' },
];

export const SORT_ORDER: SortOrder[] = [
    { key: 'asc', label: 'Cũ nhất trước' },
    { key: 'desc', label: 'Mới nhất trước' },
];


export type ReportTypeKey = "ALL" | "GROUP" | 'COMMENT' | 'POST' | 'USER'
export type ReportStatusKey = "ALL" | "PENDING" | 'RESOLVED' | 'REJECTED' 

export interface ReportTypeFilter {
    key: ReportTypeKey;
    label: string;
}

interface ReportStatusFilter {
    key: ReportStatusKey;
    label: string;
}

export const REPORT_TYPES: ReportTypeFilter[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'GROUP', label: 'Nhóm' },
    { key: 'COMMENT', label: 'Bình luận' },
    { key: 'USER', label: 'Người dùng' },
    { key: 'POST', label: 'Bài viết' },
];

export const REPORT_STATUSES: ReportStatusFilter[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xử lí' },
    { key: 'REJECTED', label: 'Đã từ chối' },
    { key: 'RESOLVED', label: 'Đã xử lí' },
];